package ton

import (
	"context"
	"fmt"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

func InitAPI(ctx context.Context, config string) (ton.APIClientWrapped, error) {

	// создаем узлы (lite servers) которые помогают читать блокчейн
	client := liteclient.NewConnectionPool()

	// подхватываем списоск lite servers
	cfg, err := liteclient.GetConfigFromUrl(context.Background(), config)
	err = client.AddConnectionsFromConfigUrl(ctx, config)
	if err != nil {
		fmt.Println(err)
	}

	api := ton.NewAPIClient(client, ton.ProofCheckPolicyFast).WithRetry()
	api.SetTrustedBlockFromConfig(cfg)

	// api который реализует высокоуровневые методы, работает быстро,
	//Api = ton.NewAPIClient(client)
	//
	//// автоматически повторяет запросы при временных ошибках.
	//Api = Api.WithRetry(3)
	return api, nil
}
