import { getFirestore } from "firebase-admin/firestore";

export default async function getAllStoreProduct(link) {
  const ref = getFirestore().collection(`store/${link}/products`);

  let products = [];

  await ref
    .get()
    .then((data) => {
      data.forEach((product) => {
        if (product.exists) {
          products.push({ ...product.data(), productId: product.id });
        } else {
          throw "Store has no product";
        }
      });
    })
    .catch((err) => console.log(err));

  return { store: products };
}
