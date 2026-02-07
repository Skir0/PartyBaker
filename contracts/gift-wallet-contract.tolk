import "@stdlib/gas-payments"
import "errors"
import "storage"
import "messages"
import "utils"

type AllowedInternalMessage =  TransferNotification
                                | CancelGift
                                | ReturnAmount
                                | ChangeAdmin
                                | ChangeTargetAmount
                                | TestActiveGift;

fun onInternalMessage(in: InMessage) {

    // deploy
    if (in.body.isEmpty()) {
        return;
    }

    val msg = lazy AllowedInternalMessage.fromSlice(in.body);

    match (msg) {
        TestActiveGift => {
            var giftStorage = lazy GiftStorage.load();
            giftStorage.status = GiftStatus.ACTIVE;
            giftStorage.save();
        }

        // transfer amount
        TransferNotification => {
            var giftStorage = GiftStorage.load();

            val giftJettonWalletAddress = calcAddressOfJettonWallet(
                contract.getAddress(),
                giftStorage.acceptedMinterAddress,
                giftStorage.code
            );

            assert (in.senderAddress == giftJettonWalletAddress) throw ERROR_NOT_VALID_WALLET;

            assert (giftStorage.status == GiftStatus.ACTIVE) throw ERROR_NOT_ACTIVE_GIFT;

            var oldAmount = giftStorage.contributors.get(msg.senderAddress!!);
            var temp: coins = oldAmount.isFound ? oldAmount.loadValue() : 0;
            giftStorage.contributors.set(msg.senderAddress!!, temp + msg.amount);

            giftStorage.collectedAmount += msg.amount;

            if (giftStorage.collectedAmount >= giftStorage.targetAmount) {

                val askToTransfer = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: giftJettonWalletAddress,
                    value: 0,
                    body: AskToTransfer {
                        queryId: msg.queryId,
                        amount: giftStorage.collectedAmount,
                        destination: giftStorage.adminAddress,
                        responseDestination: giftStorage.adminAddress,
                        customPayload: null,
                        forwardTonAmount: ton("0.01"),
                        forwardPayload: beginCell()
                            .storeUint(0, 32)
                            .storeSlice("Collect total sum for gift, send money to buyer")
                            .endCell()
                    }
                });
                askToTransfer.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
                giftStorage.status = GiftStatus.PAID;
            }
            giftStorage.save();
        }

        // cancel the gift by admin
        CancelGift => {
            var giftStorage = lazy GiftStorage.load();

            assert (in.senderAddress == giftStorage.adminAddress) throw ERROR_NOT_FROM_ADMIN;
            assert (giftStorage.status == GiftStatus.ACTIVE) throw ERROR_NOT_ACTIVE_GIFT;

            giftStorage.status = GiftStatus.CANCELLED;
            giftStorage.save();
        }

        // user wants to return his money
        ReturnAmount => {
            var giftStorage = lazy GiftStorage.load();

            val giftJettonWalletAddress = calcDeployedJettonWallet(
                contract.getAddress(),
                giftStorage.acceptedMinterAddress,
                giftStorage.code
            );

            // possibly to delete this line
            assert (giftStorage.status == GiftStatus.CANCELLED) throw ERROR_NOT_CANCELLED_GIFT;

            val amountToReturn = giftStorage.contributors.get(in.senderAddress);
            assert (amountToReturn.isFound) throw ERROR_CONTRIBUTOR_NOT_EXIST;
            val amountAsCoins = amountToReturn.loadValue();

            giftStorage.contributors.delete(in.senderAddress);
            giftStorage.collectedAmount -= amountAsCoins;

            val askToTransfer = createMessage({
                bounce: BounceMode.NoBounce,
                dest: giftJettonWalletAddress,
                value: 0,
                body: AskToTransfer {
                    queryId: msg.queryId,
                    amount: amountAsCoins,
                    destination: in.senderAddress,
                    responseDestination: in.senderAddress,
                    customPayload: null,
                    forwardTonAmount: ton("0.01"),
                    forwardPayload: beginCell()
                        .storeSlice("Return")
                        .endCell()
                }
            });
            askToTransfer.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);

            giftStorage.save();
        }
        ChangeAdmin => {
            var giftStorage = lazy GiftStorage.load();

            assert (in.senderAddress == giftStorage.adminAddress) throw ERROR_NOT_FROM_ADMIN;
            assert (giftStorage.status == GiftStatus.ACTIVE) throw ERROR_NOT_ACTIVE_GIFT;

            giftStorage.adminAddress = msg.newAdminAddress;

            val reply = createMessage({
                bounce: BounceMode.NoBounce,
                dest: msg.newAdminAddress,
                value: 0,
            });
            reply.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);

            giftStorage.save();
        }
        ChangeTargetAmount => {
            var giftStorage = lazy GiftStorage.load();

            assert (in.senderAddress == giftStorage.adminAddress) throw ERROR_NOT_FROM_ADMIN;
            assert (giftStorage.status == GiftStatus.ACTIVE) throw ERROR_NOT_ACTIVE_GIFT;

            giftStorage.targetAmount = msg.newTargetAmount;

            giftStorage.save();
        }
    }
}

struct GiftWalletDataReply {
    status: GiftStatus
    targetAmount: coins
    collectedAmount: coins
    adminAddress: address
    acceptedMinterAddress: address
    contributors: map<address, coins>
    code: cell
}

get fun get_wallet_data(): GiftWalletDataReply {
    var giftStorage = lazy GiftStorage.load();
    return {
        status: giftStorage.status,
        targetAmount: giftStorage.targetAmount,
        collectedAmount: giftStorage.collectedAmount,
        adminAddress: giftStorage.adminAddress,
        acceptedMinterAddress: giftStorage.acceptedMinterAddress,
        contributors: giftStorage.contributors,
        code: giftStorage.code
    }
}

get fun get_status(): GiftStatus {
    var giftStorage = lazy GiftStorage.load();
    return giftStorage.status;
}

get fun get_collected_amount(): coins {
    var giftStorage = lazy GiftStorage.load();
    return giftStorage.collectedAmount;
}
get fun get_admin_address(): address {
    var giftStorage = lazy GiftStorage.load();
    return giftStorage.adminAddress;
}

get fun get_target_amount(): coins {
    var giftStorage = lazy GiftStorage.load();
    return giftStorage.targetAmount;
}