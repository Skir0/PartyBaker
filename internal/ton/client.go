package ton

import (
	"context"
	"fmt"

	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
)

var Api ton.APIClientWrapped

func InitAPI(ctx context.Context, config string) error {

	// создаем узлы (lite servers) которые помогают читать блокчейн
	client := liteclient.NewConnectionPool()

	// подхватываем списоск lite servers
	err := client.AddConnectionsFromConfigUrl(ctx, config)
	if err != nil {
		fmt.Println(err)
	}

	// api который реализует высокоуровневые методы, работает быстро,
	Api = ton.NewAPIClient(client)

	// автоматически повторяет запросы при временных ошибках.
	Api = Api.WithRetry(3)
	return nil
}
