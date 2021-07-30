import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import firebaseApp from 'firebase';
import { firebase, FieldValue } from '../../../libs/firebase';
import backfaceFixed from '../../../utils/backfaceFixed';
import * as ROUTES from '../../../constants/routes';
import { getDocumentByArraysIn } from '../../../utils/firebase';
import { selectLoggedInUser } from '../../../store/slices/loggedInUserSlice';
import { selectLoggedInUserPhotos } from '../../../store/slices/loggedInUserPhotosSlice';
import { onAccountDeleteToast } from '../../../store/slices/accountDeleteToastSlice';
import { responcePhotoData, responceUserData } from '../../../models/responceData';

interface PROPS {
  setIsDeleteAccountModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountModal: React.FC<PROPS> = ({ setIsDeleteAccountModalOpen }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const activeUser = useSelector(selectLoggedInUser);
  const loggedInUserPhotos = useSelector(selectLoggedInUserPhotos);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    backfaceFixed(false);
    setIsDeleteAccountModalOpen(false);
  };

  const deleteAccount = async () => {
    setIsLoading(true);
    try {
      // Authから削除されたユーザーを削除
      const { currentUser } = firebase.auth();
      if (currentUser) {
        await currentUser.delete().catch((err) => {
          throw new Error((err as Error).message);
        });
      } else {
        throw new Error('ログインできていない状態です。再度ログインをお願いいたします。');
      }

      // 削除されたユーザーが投稿した写真にお気に入りしたユーザーのlikesから削除
      const activeUserPhotoIds = loggedInUserPhotos.map((photo) => photo.docId as string);
      if (loggedInUserPhotos.length > 0 && activeUserPhotoIds) {
        const getQuery = (batch: string[]) => firebase.firestore().collection('users').where('likes', 'array-contains-any', batch);
        const LikedUser = await getDocumentByArraysIn<responceUserData>(activeUserPhotoIds, getQuery);
        if (LikedUser && LikedUser.length > 0) {
          await Promise.all(
            LikedUser.map((user) => {
              firebase
                .firestore()
                .collection('users')
                .doc(user.docId)
                .update({
                  likes: user.likes.filter((likeId) => activeUserPhotoIds.some((activeUserId) => likeId !== activeUserId)),
                })
                .catch((err: firebaseApp.firestore.FirestoreError) => {
                  throw new Error(err.message);
                });
              return user;
            })
          ).catch((err: firebaseApp.firestore.FirestoreError) => {
            throw new Error(err.message);
          });
        }
      }

      // 投稿のお気に入りにある削除されたユーザーのIDを削除
      if (activeUser.likes.length > 0) {
        await firebase
          .firestore()
          .collection('photos')
          .where('likes', 'array-contains', `${activeUser.userId}`)
          .get()
          .then(async (res) => {
            await Promise.all(
              res.docs.map((doc) => {
                firebase
                  .firestore()
                  .collection('photos')
                  .doc(doc.id)
                  .update({
                    likes: FieldValue.arrayRemove(activeUser.userId),
                  })
                  .catch((err: firebaseApp.firestore.FirestoreError) => {
                    throw new Error(err.message);
                  });
                return doc;
              })
            ).catch((err: firebaseApp.firestore.FirestoreError) => {
              throw new Error(err.message);
            });
          });
      }

      // 削除されたユーザーのコメントを削除
      await firebase
        .firestore()
        .collection('photos')
        .where('comments', '!=', [])
        .get()
        .then(async (res) => {
          if (res.docs.length > 0) {
            await Promise.all(
              res.docs.map((doc) => {
                if ((doc.data() as responcePhotoData).comments.some((comment) => comment.displayName === activeUser.username)) {
                  firebase
                    .firestore()
                    .collection('photos')
                    .doc(doc.id)
                    .update({
                      comments: (doc.data() as responcePhotoData).comments.filter((comment) => comment.displayName !== activeUser.username),
                    })
                    .catch((err: firebaseApp.firestore.FirestoreError) => {
                      throw new Error(err.message);
                    });
                }
                return doc;
              })
            ).catch((err: firebaseApp.firestore.FirestoreError) => {
              throw new Error(err.message);
            });
          }
        });

      // すべてのユーザーのフォローから削除されたユーザーを削除
      if (activeUser.followers.length > 0) {
        await firebase
          .firestore()
          .collection('users')
          .where('following', 'array-contains', `${activeUser.userId}`)
          .get()
          .then(async (res) => {
            if (res.docs.length > 0) {
              await Promise.all(
                res.docs.map((doc) => {
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(doc.id)
                    .update({
                      following: FieldValue.arrayRemove(activeUser.userId),
                    })
                    .catch((err: firebaseApp.firestore.FirestoreError) => {
                      throw new Error(err.message);
                    });
                  return doc;
                })
              ).catch((err: firebaseApp.firestore.FirestoreError) => {
                throw new Error(err.message);
              });
            }
          });
      }

      // すべてのユーザーのフォロワーから削除されたユーザーを削除
      if (activeUser.following.length > 0) {
        await firebase
          .firestore()
          .collection('users')
          .where('followers', 'array-contains', `${activeUser.userId}`)
          .get()
          .then(async (res) => {
            if (res.docs.length > 0) {
              await Promise.all(
                res.docs.map((doc) => {
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(doc.id)
                    .update({
                      followers: FieldValue.arrayRemove(activeUser.userId),
                    })
                    .catch((err: firebaseApp.firestore.FirestoreError) => {
                      throw new Error(err.message);
                    });
                  return doc;
                })
              ).catch((err: firebaseApp.firestore.FirestoreError) => {
                throw new Error(err.message);
              });
            }
          });
      }

      // 削除されたユーザーをコレクションから削除
      await firebase
        .firestore()
        .collection('users')
        .doc(activeUser.docId)
        .delete()
        .catch((err: firebaseApp.firestore.FirestoreError) => {
          throw new Error(err.message);
        });

      // 削除されたユーザーの投稿したPhotoを削除
      if (loggedInUserPhotos) {
        await Promise.all(
          loggedInUserPhotos.map((photo) => {
            firebase
              .firestore()
              .collection('photos')
              .doc(photo.docId)
              .delete()
              .catch((err: firebaseApp.firestore.FirestoreError) => {
                throw new Error(err.message);
              });
            return photo;
          })
        ).catch((err: firebaseApp.firestore.FirestoreError) => {
          throw new Error(err.message);
        });
      }
      dispatch(onAccountDeleteToast());
      backfaceFixed(false);
      history.push(ROUTES.SIGN_UP);
      setIsLoading(false);
    } catch (error) {
      if ((error as Error).message.includes('sensitive')) {
        alert('ログインしてから時間が経過しています。再度ログインし直してください。');
      } else {
        alert((error as Error).message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-30 top-0 left-0 w-full h-full">
      <button type="button" aria-label="閉じる" onClick={() => closeModal()} className="bg-black-base opacity-70 cursor-pointer h-full w-full" />
      <div className="bg-white absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-170px w-330px z-10 rounded">
        <div className="bg-white flex justify-center items-center overflow-auto w-full h-full rounded">
          <div className="inline-block font-bold p-5">
            <p className="text-base">アカウントに関する情報はすべて削除されます。 本当にアカウントを削除しますか？</p>
            <div className="mt-5 flex items-center justify-center">
              <button
                type="button"
                className="border border-gray-700 text-gray-700 px-3 py-2 mr-5 rounded-md hover:opacity-70 text-sm"
                onClick={closeModal}
              >
                キャンセル
              </button>
              <button
                type="button"
                className={`bg-red-600 text-white px-3 py-2 rounded-md  0 text-sm ${isLoading ? 'cursor-default opacity-50' : 'hover:opacity-70'}`}
                onClick={deleteAccount}
                disabled={isLoading}
              >
                {isLoading ? '削除中...' : '削除'}
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => closeModal()}
          className="bg-black-base p-2 rounded-full absolute top-0 right-0  overflow-visible z-20 transform -translate-y-1/2 translate-x-1/2 hover:opacity-80"
        >
          <img width="16px" height="16px" src="/images/closeButton.png" alt="閉じるボタン" />
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
