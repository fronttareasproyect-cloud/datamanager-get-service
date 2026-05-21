# datamanager-get-service

Datamanager sencillo para consumir productos desde DummyJSON.

## Uso

```js
import { productDatamanager } from 'datamanager-get-service';

const { rows, total } = await productDatamanager.getProducts();
const detail = await productDatamanager.getProductDetail(rows[0].id);
```

`getProducts` devuelve los datos ya mapeados para pintarlos en la tabla del proyecto web.
`getProductDetail` pide el detalle de un producto concreto usando su `id`.
