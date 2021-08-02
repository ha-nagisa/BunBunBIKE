/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-onchange */
/* eslint-disable no-nested-ternary */

import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { firebase } from '../../../libs/firebase';
import Header from '../../components/block/header';
import * as ROUTES from '../../../constants/routes';
import ResetPasswordModal from '../../components/modules/resetPasswordModal';
import backfaceFixed from '../../../utils/backfaceFixed';
import { doesUsernameExist } from '../../../utils/firebase';
import DeleteAccountModal from './deleteAccountModal';

import DEFAULT_IMAGE_PATH from '../../../constants/paths';
import { selectLoggedInUser, updateProfile, updateProfileWithImage } from '../../../store/slices/loggedInUserSlice';
import { responcePhotoData } from '../../../models/responceData';
import { updateLoggeInUserName } from '../../../store/slices/loggedInUserPhotosSlice';
import MakerOptions from '../../components/atoms/maker-options';

const ProfileEdit: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const activeUser = useSelector(selectLoggedInUser);

  const [username, setUsername] = useState('');
  const [bikeImage, setBikeImage] = useState<File | string>('');
  const [previewBikeImageSrc, setPreviewBikeImageSrc] = useState('');
  const [maker, setMaker] = useState('');
  const [carModel, setCarModel] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isActioning, setIsActioning] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const isLoggedInUser = location.pathname === `/p/${activeUser?.username}/edit`;
  const isInvalid = emailAddress === '' || username === '' || bikeImage === '' || maker === '' || carModel === '' || isActioning;

  useEffect(() => {
    document.title = 'Profile Edit | Bun Bun BIKE';
  }, []);

  useEffect(() => {
    if (!isLoggedInUser) {
      history.push(ROUTES.NOT_FOUND);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedInUser, location]);

  useEffect(() => {
    setUsername(activeUser?.username);
    setBikeImage(activeUser?.bikeImageUrl);
    setPreviewBikeImageSrc(activeUser?.bikeImageUrl);
    setMaker(activeUser?.maker);
    setCarModel(activeUser?.carModel);
    setEmailAddress(activeUser?.emailAddress);
  }, [activeUser]);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null && e.currentTarget.files[0]) {
      setBikeImage(e.currentTarget.files[0]);

      const selectedFile = e.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewBikeImageSrc(imageUrl);

      e.target.value = '';
    }
  };

  const openResetModal = () => {
    setIsResetModalOpen(true);
    backfaceFixed(true);
  };

  const openDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true);
    backfaceFixed(true);
  };

  const successResetToast = () =>
    toast.success(' パスワードのリセットに関する案内メールが送信されました。', {
      style: {
        border: '1px solid #ffffff',
        padding: '16px',
        color: 'rgb(55, 65, 81)',
        background: '#ffffff',
      },
      iconTheme: {
        primary: '#ff9800',
        secondary: '#ffffff',
      },
    });

  const successUpdateToast = () =>
    toast.success('正常にプロフィール情報が更新されました。', {
      style: {
        border: '1px solid #ffffff',
        padding: '16px',
        color: 'rgb(55, 65, 81)',
        background: '#ffffff',
      },
      iconTheme: {
        primary: '#ff9800',
        secondary: '#ffffff',
      },
    });

  const handleEditProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsActioning(true);
    if (isLoggedInUser) {
      const usernameExists = await doesUsernameExist(username);
      try {
        if (usernameExists && activeUser.username !== username) {
          throw new Error('既に入力したユーザーネームを持ったユーザーが存在します。ユーザーネームを変更してください。');
        }
        const { currentUser } = firebase.auth();

        if (currentUser && activeUser.emailAddress !== emailAddress) {
          await currentUser.updateEmail(emailAddress).catch((error) => {
            throw new Error((error as Error).message);
          });
        }

        let url = '';
        if (bikeImage && activeUser?.bikeImageUrl !== bikeImage && typeof bikeImage !== 'string') {
          const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          const N = 16;
          const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
            .map((n) => S[n % S.length])
            .join('');
          const fileName = `${randomChar}_${bikeImage.name}`;
          await firebase.storage().ref(`bikes/${fileName}`).put(bikeImage);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          url = await firebase.storage().ref('bikes').child(fileName).getDownloadURL();

          if (currentUser) {
            await currentUser
              .updateProfile({
                displayName: username.toLowerCase(),
                photoURL: url,
              })
              .catch((error) => {
                throw new Error((error as Error).message);
              });
          }

          await firebase
            .firestore()
            .collection('users')
            .doc(activeUser?.docId)
            .update({
              username: username.toLowerCase(),
              bikeImageUrl: url,
              carModel,
              maker,
              emailAddress: emailAddress.toLowerCase(),
            })
            .catch((error) => {
              throw new Error((error as Error).message);
            });

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
                          comments: (doc.data() as responcePhotoData).comments.map((e) => {
                            if (e.displayName === activeUser.username) {
                              return {
                                comment: e.comment,
                                displayName: username.toLowerCase(),
                              };
                            }
                            return e;
                          }),
                        })
                        .catch((error) => {
                          throw new Error((error as Error).message);
                        });
                    }
                    return doc;
                  })
                ).catch((error) => {
                  throw new Error((error as Error).message);
                });
              }
            });

          dispatch(updateProfileWithImage({ bikeImageUrl: url, carModel, emailAddress, maker, username }));

          successUpdateToast();
        } else {
          if (currentUser && activeUser.username !== username.toLowerCase()) {
            await currentUser
              .updateProfile({
                displayName: username.toLowerCase(),
              })
              .catch((error) => {
                throw new Error((error as Error).message);
              });
          }

          await firebase
            .firestore()
            .collection('users')
            .doc(activeUser?.docId)
            .update({
              username: username.toLowerCase(),
              carModel,
              maker,
              emailAddress: emailAddress.toLowerCase(),
            })
            .catch((error) => {
              throw new Error((error as Error).message);
            });

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
                          comments: (doc.data() as responcePhotoData).comments.map((e) => {
                            if (e.displayName === activeUser.username) {
                              return {
                                comment: e.comment,
                                displayName: username.toLowerCase(),
                              };
                            }
                            return e;
                          }),
                        })
                        .catch((error) => {
                          throw new Error((error as Error).message);
                        });
                    }
                    return doc;
                  })
                ).catch((error) => {
                  throw new Error((error as Error).message);
                });
              }
            });

          dispatch(updateProfile({ carModel, emailAddress, maker, username }));
          successUpdateToast();
        }

        dispatch(updateLoggeInUserName({ username: username.toLowerCase() }));
        history.push(`/p/${username}/edit`);
      } catch (error) {
        setErrorText((error as Error).message);
      }
    } else {
      history.push(ROUTES.LOGIN);
    }
    setIsActioning(false);
  };

  return (
    <div className="bg-gray-background relative pb-10">
      <Header />
      <section className="py-10 bg-gray-100  bg-opacity-50  h-auto">
        <form onSubmit={handleEditProfile} className="mx-auto container max-w-2xl md:w-3/4 shadow-md w-11/12">
          <div className="bg-white p-4 border-t-2 bg-opacity-5 border-logoColor-base rounded-t">
            <h1 className="text-gray-600 text-center text-lg">アカウント設定</h1>
          </div>
          <div className="bg-white space-y-6 mt">
            <div className="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 items-center pt-6">
              <h2 className="md:w-1/3 max-w-sm mx-auto">アカウント</h2>
              <div className="md:w-2/3 max-w-sm mx-auto space-y-5">
                <div>
                  <label htmlFor="username" className="text-sm text-gray-400">
                    ユーザーネーム
                  </label>
                  <div className="w-full inline-flex border">
                    <div className="w-1/12 pt-2 bg-gray-100">
                      <svg fill="none" className="w-6 text-gray-400 mx-auto" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="w-11/12 border border-gray-400 focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base focus:text-gray-600 p-2 text-black-base"
                      placeholder="田中太郎"
                      onChange={({ target }) => setUsername(target.value.trim())}
                      value={username}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-sm text-gray-400">
                    メールアドレス
                  </label>
                  <div className="w-full inline-flex border">
                    <div className="pt-2 w-1/12 bg-gray-100 bg-opacity-50">
                      <svg fill="none" className="w-6 text-gray-400 mx-auto" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="w-11/12  border border-gray-400  focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base focus:text-gray-600 p-2 text-black-base"
                      placeholder="email@example.com"
                      onChange={({ target }) => setEmailAddress(target.value)}
                      value={emailAddress}
                    />
                  </div>
                </div>
                <div>
                  <button type="button" onClick={openResetModal} className="text-sm text-logoColor-base focus:outline-none hover:opacity-70">
                    パスワードの変更はこちらから
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <div className="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500 items-center">
              <h2 className="md:w-1/3 mx-auto max-w-sm">バイク情報</h2>
              <div className="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  {bikeImage ? (
                    <div className="text-center">
                      <img className="inline object-cover w-24 h-24 mr-2 rounded-full" src={previewBikeImageSrc} alt="" />
                      <br />
                      <div className="inline-block">
                        <label className="text-sm text-logoColor-littleLight cursor-pointer underline mb-2 inline-block hover:opacity-70">
                          写真を変更する
                          <input type="file" className="hidden" onChange={onChangeImageHandler} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <label className="cursor-pointer mb-2 inline-block hover:opacity-70">
                        <img
                          className="inline object-cover w-20 h-20 mr-2 rounded-full border-2 border-gray-primary"
                          src={DEFAULT_IMAGE_PATH}
                          alt="bike example"
                        />
                        <br />
                        <span className="text-xs">バイクの画像</span>
                        <input type="file" className="hidden" onChange={onChangeImageHandler} />
                      </label>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="maker" className="text-sm text-gray-400">
                    メーカー
                  </label>
                  <div className="w-full inline-flex border">
                    <select
                      className="w-full border border-gray-400  focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base focus:text-gray-600 p-2 text-black-base"
                      id="maker"
                      value={maker}
                      onChange={(e) => setMaker(e.target.value)}
                    >
                      <option value="" className="hidden">
                        選択する
                      </option>
                      <MakerOptions />
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="carModel" className="text-sm text-gray-400">
                    車種
                  </label>
                  <div className="w-full inline-flex border">
                    <input
                      id="carModel"
                      type="text"
                      name="carModel"
                      className="w-full  border border-gray-400  focus:outline-logoColor focus:ring-logoColor-base focus:border-logoColor-base focus:text-gray-600 p-2 text-black-base"
                      placeholder="例) GB350"
                      onChange={({ target }) => setCarModel(target.value)}
                      value={carModel}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className={`text-white text-center w-auto mx-auto max-w-sm rounded-md bg-logoColor-base py-2 px-4 inline-flex items-center focus:outline-none mt-3 ${
                      isInvalid ? 'opacity-50' : 'hover:opacity-70'
                    }`}
                    disabled={isInvalid}
                  >
                    {isActioning ? (
                      '更新中...'
                    ) : (
                      <>
                        {' '}
                        <svg fill="none" className="w-4 text-white mr-2" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        更新
                      </>
                    )}
                  </button>
                  {errorText ? (
                    errorText.includes('Log in again before retrying this request.') ? (
                      <p className="p-4 text-xs text-red-primary text-left">
                        ログインから時間が経過しています。
                        <button
                          type="button"
                          className="text-logoColor-base focus:outline-none underline"
                          onClick={() => {
                            firebase
                              .auth()
                              .signOut()
                              .catch((err) => alert((err as Error).message));
                            history.push(ROUTES.LOGIN);
                          }}
                        >
                          こちら
                        </button>
                        から再度ログインをお願いいたします。
                      </p>
                    ) : (
                      <p className="p-4 text-xs text-red-primary text-right">{errorText}</p>
                    )
                  ) : null}
                </div>
              </div>
            </div>

            <hr />

            <div className="w-full p-4 text-right text-white ">
              <button
                type="button"
                onClick={openDeleteAccountModal}
                className="inline-flex items-center focus:outline-none mr-4 bg-red-600 px-3 py-2 rounded-md hover:opacity-70"
              >
                <svg fill="none" className="w-4 mr-2" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                アカウントの削除
              </button>
            </div>
          </div>
        </form>
      </section>
      {isResetModalOpen ? (
        <ResetPasswordModal
          setIsResetModalOpen={setIsResetModalOpen}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          successResetToast={successResetToast}
        />
      ) : null}
      {isDeleteAccountModalOpen ? <DeleteAccountModal setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen} /> : null}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 8000,
          // Default options for specific types
          success: {
            duration: 5000,
          },
        }}
      />
    </div>
  );
};

export default ProfileEdit;
