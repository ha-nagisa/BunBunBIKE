/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-onchange */

import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { firebase } from '../../../libs/firebase';
import * as ROUTES from '../../../constants/routes';
import { doesUsernameExist, getUserByUserId } from '../../../utils/firebase';
import DEFAULT_IMAGE_PATH from '../../../constants/paths';
import { setActiveUser } from '../../../store/slices/loggedInUserSlice';
import MakerOptions from '../../components/atoms/maker-options';

const SignUp: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [bikeImage, setBikeImage] = useState<File | string>('');
  const [previewBikeImageSrc, setPreviewBikeImageSrc] = useState('');
  const [maker, setMaker] = useState('');
  const [carModel, setCarModel] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isActioning, setIsActioning] = useState(false);
  const [error, setError] = useState('');
  const isInvalid =
    password === '' || emailAddress === '' || username === '' || bikeImage === '' || maker === '' || carModel === '' || password.length < 6;

  useEffect(() => {
    document.title = 'Sign Up | Bun Bun Bike';
  }, []);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null && e.currentTarget.files[0]) {
      setBikeImage(e.currentTarget.files[0]);

      const selectedFile = e.currentTarget.files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setPreviewBikeImageSrc(imageUrl);

      e.target.value = '';
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsActioning(true);
    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const createdUserResult = await firebase.auth().createUserWithEmailAndPassword(emailAddress, password);

        let url = '';
        if (bikeImage && typeof bikeImage !== 'string') {
          const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          const N = 16;
          const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
            .map((n) => S[n % S.length])
            .join('');
          const fileName = `${randomChar}_${bikeImage.name}`;
          await firebase.storage().ref(`bikes/${fileName}`).put(bikeImage);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          url = await firebase.storage().ref('bikes').child(fileName).getDownloadURL();
        }

        if (createdUserResult.user) {
          await createdUserResult.user.updateProfile({
            displayName: username,
            photoURL: url,
          });

          await firebase.firestore().collection('users').add({
            userId: createdUserResult.user.uid,
            username: username.toLowerCase(),
            bikeImageUrl: url,
            carModel,
            maker,
            emailAddress: emailAddress.toLowerCase(),
            following: [],
            followers: [],
            likes: [],
            dateCreated: Date.now(),
          });

          const [user] = await getUserByUserId(createdUserResult.user.uid);
          dispatch(setActiveUser(user || {}));
        }

        setIsActioning(false);
        history.push(ROUTES.DASHBOARD);
      } catch (err) {
        setBikeImage('');
        setMaker('');
        setCarModel('');
        setEmailAddress('');
        setPassword('');
        setError((err as Error).message);
        setIsActioning(false);
      }
    } else {
      setUsername('');
      setError('既に入力したユーザーネームを持ったユーザーが存在します。ユーザーネームを変更してください。');
      setIsActioning(false);
    }
  };

  return (
    <div className="container flex mx-auto max-w-screen-lg items-center h-screen px-3 py-3 sm:py-0 ">
      <div className="hidden sm:flex w-1/2 shadow-lg">
        <div>
          <img src="/images/loginLogo.png" alt="Bun Bun BIKE" />
        </div>
      </div>
      <div className="flex flex-col w-full sm:w-1/2 sm:pt-harf sm:relative sm:border-0">
        <div className="flex flex-col items-center sm:w-4/5 rounded mx-auto sm:mx-0 sm:absolute sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2">
          <div className="bg-white p-4 mb-4 shadow-lg text-center mt-4">
            <div className="mb-5 block sm:hidden text-center">
              <img src="/images/smLoginLogo.png" className="inline-block" alt="Bun Bun BIKE" width="300px" />
            </div>
            <h1 className="hidden sm:flex justify-center w-full font-logoFont font-bold mb-5 text-2xl">サインアップ</h1>

            {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

            <form onSubmit={handleSignUp} method="POST">
              <input
                aria-label="Enter your username"
                type="text"
                placeholder="ユーザーネーム"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-2 border-gray-primary focus:outline-none focus:ring-2 focus:ring-logoColor-light rounded mb-4 focus:border-transparent"
                onChange={({ target }) => setUsername(target.value)}
                value={username}
              />
              {bikeImage ? (
                <div className="text-center">
                  <img className="inline object-cover w-16 h-16 mr-2 rounded-full" src={previewBikeImageSrc} alt="" />
                  <br />
                  <div className="inline-block hover:opacity-70">
                    <label className="text-sm text-logoColor-littleLight cursor-pointer underline mb-2 inline-block">
                      写真を変更する
                      <input type="file" className="hidden" onChange={onChangeImageHandler} />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <label className="cursor-pointer mb-2 inline-block hover:opacity-70">
                    <img
                      className="inline object-cover w-16 h-16 mr-2 rounded-full border-2 border-gray-primary"
                      src={DEFAULT_IMAGE_PATH}
                      alt="bike example"
                    />
                    <br />
                    <span className="text-xs">バイクの画像</span>
                    <input type="file" className="hidden" onChange={onChangeImageHandler} />
                  </label>
                </div>
              )}
              <select
                className="py-2 px-3 rounded border-2 w-full text-gray-base border-gray-primary mb-4 mt-1 focus:outline-none focus:ring-2 focus:ring-logoColor-light focus:border-transparent"
                id="maker"
                value={maker}
                onChange={(e) => setMaker(e.target.value)}
              >
                <option value="" className="hidden">
                  メーカー
                </option>
                <MakerOptions />
              </select>
              <input
                aria-label="Enter your full name"
                type="text"
                placeholder="車種"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-2 border-gray-primary focus:outline-none focus:ring-2 focus:ring-logoColor-light rounded mb-4 focus:border-transparent"
                onChange={({ target }) => setCarModel(target.value)}
                value={carModel}
              />
              <input
                aria-label="Enter your email address"
                type="email"
                placeholder="メールアドレス"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border-2 border-gray-primary focus:outline-none focus:ring-2 focus:ring-logoColor-light rounded mb-4 focus:border-transparent"
                onChange={({ target }) => setEmailAddress(target.value)}
                value={emailAddress}
              />
              <div className="mb-4">
                <input
                  aria-label="Enter your password"
                  type="password"
                  placeholder="パスワード"
                  className="text-sm text-gray-base w-full py-5 px-4 h-2 border-2 border-gray-primary focus:outline-none focus:ring-2 focus:ring-logoColor-light rounded focus:border-transparent"
                  onChange={({ target }) => {
                    setPassword(target.value);
                  }}
                  value={password}
                />
                {password.length > 0 && password.length < 6 ? (
                  <p className="text-xs text-red-primary mt-1">英数字で6文字以上入力してください。</p>
                ) : null}
              </div>
              <button
                disabled={isInvalid || isActioning}
                type="submit"
                className={`bg-logoColor-base border border-logoColor-base text-white w-full rounded h-10 font-bold mb-2 focus:outline-logoColor
            ${isInvalid || isActioning ? 'opacity-50 cursor-default' : 'hover:bg-white hover:text-logoColor-base'}`}
              >
                {isActioning ? '読み込み中...' : 'Sign Up'}
              </button>
            </form>
            <p className="text-sm">
              アカウントを既にお持ちですか？{` `}
              <Link to={ROUTES.LOGIN} className="font-bold text-logoColor-base">
                ログイン
              </Link>
            </p>
          </div>
          <div className="text-xs mb-4">
            ※使い方は
            <a href="https://nagisa-profile.com/works/bike-custom-diary" className="font-bold text-gray-400 underline">
              こちら
            </a>
            から、お問い合わせは
            <a href="https://nagisa-profile.com/contact" className="font-bold text-gray-400 underline">
              こちら
            </a>
            から
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
