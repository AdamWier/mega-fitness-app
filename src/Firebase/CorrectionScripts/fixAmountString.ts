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
      documents.map((document) => {
        const data = document.data();
        return t.update(document.ref, {
          ...data,
          meal: data?.meal.map((food: any) =>
            food.amount ? { ...food, amount: Number(food.amount) } : food
          ),
        });
      })
    );
  });
});
