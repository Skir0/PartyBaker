import "@stdlib/gas-payments"
import "errors"
import "jetton-utils"
import "fees-management"
import "storage"
import "messages"
import "utils"

type AllowedInternalMessage =  TransferNotification | CancelGift | ReturnAmount | ChangeAdmin;

fun onInternalMessage(in: InMessage) {

    val msg = lazy AllowedInternalMessage.fromSlice(in.body);

    match (msg) {

        // transfer amount
        TransferNotification => {
            var giftStorage = GiftStorage.load();

            val giftJettonWalletAddress = calcDeployedJettonWallet(
                contract.getAddress(),
                giftStorage.acceptedMinterAddress,
                giftStorage.code
            );

            assert (in.senderAddress == giftJettonWalletAddress) throw ERROR_NOT_VALID_WALLET;

            assert (giftStorage.status == GiftStatus.ACTIVE) throw ERROR_NOT_ACTIVE_GIFT;

            var oldAmount = giftStorage.contributors.get(msg.senderAddress!!);
            if (oldAmount == null) {
                oldAmount = 0;
            }
            giftStorage.contributors.set(msg.senderAddress!!, oldAmount! + msg.amount);

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
                        forwardPayload: beginCell().storeSlice("Collect total sum for gift, send money to buyer").endCell().beginParse()
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
            assert (amountToReturn != null) throw ERROR_GUEST_NOT_EXIST;

            giftStorage.contributors.delete(in.senderAddress);
            giftStorage.collectedAmount -= amountToReturn!;

            val askToTransfer = createMessage({
                bounce: BounceMode.NoBounce,
                dest: giftJettonWalletAddress,
                value: 0,
                body: AskToTransfer {
                    queryId: msg.queryId,
                    amount: amountToReturn!,
                    destination: in.senderAddress,
                    responseDestination: in.senderAddress,
                    customPayload: null,
                    forwardTonAmount: ton("0.01"),
                    forwardPayload: beginCell().storeSlice("Return").endCell().beginParse()
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
                body: null
            });
            reply.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);

            giftStorage.save();
        }
    }
}

struct GiftWalletDataReply {
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
        targetAmount: giftStorage.targetAmount,
        collectedAmount: giftStorage.collectedAmount,
        adminAddress: giftStorage.adminAddress,
        acceptedMinterAddress: giftStorage.acceptedMinterAddress,
        contributors: giftStorage.contributors,
        code: giftStorage.code
    }
}

get fun get_status(): int {
    var giftStorage = lazy GiftStorage.load();
    return giftStorage.status;
}

