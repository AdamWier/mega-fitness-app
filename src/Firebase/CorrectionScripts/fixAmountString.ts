import admin from 'firebase-admin';

import * as serviceAccount from './dev.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

const firestore = admin.firestore();

const collectionRef = firestore.collection('meals');

collectionRef.get().then((snapshot) => {
  const docRefs = snapshot.docs.map((doc) => doc.ref);
  firestore.runTransaction(async (t) => {
    const documents = await t.getAll(...docRefs);
    await Promise.all(
      documents.map((document) =>
        t.update(document.ref, {
          ...document.data(),
          meal: document
            .data()
            .meal.map((food) => ({ ...food, amount: Number(food.amount) })),
        })
      )
    );
  });
});
