import firebaseApp from 'firebase';
import { firebase, FieldValue } from '../libs/firebase';

interface responceUserData {
  bikeImageUrl: string;
  carModel: string;
  dateCreated: number;
  emailAddress: string;
  followers: string[];
  following: string[];
  likes: string[];
  maker: string;
  userId: string;
  username: string;
  docId?: string;
}

interface responcePhotoData {
  Maker: string;
  carModel: string;
  category: string;
  comments: string[];
  dateCreated: number;
  description: string;
  imageSrc: string;
  likes: string[];
  title: string;
  userId: string;
  workHours: string;
  workMoney: string;
  docId?: string;
}

interface responsePhotoUserInfo {
  userLikedPhoto: boolean;
  username: string;
}

interface lastDocType {
  lastdoc: firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | undefined;
}

type responceUserDataWithUserInfo = responcePhotoData | responsePhotoUserInfo;
type responceUserDataWithUserInfoLastDoc = responceUserDataWithUserInfo | lastDocType;
type responceBothData = responceUserData | responcePhotoData;

// ユーザーネームを持ったユーザーが存在するかをチェック
export async function doesUsernameExist(username: string): Promise<boolean> {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();

  return result.docs.length > 0;
}

// ユーザーネームによってuserのドキュメントを取得
export async function getUserByUsername(username: string): Promise<responceUserData[]> {
  const result = await firebase.firestore().collection('users').where('username', '==', username).get();

  return result.docs.map((item) => ({
    ...(item.data() as responceUserData),
    docId: item.id,
  }));
}

// ユーザーのIDによってuserのドキュメントを取得
export async function getUserByUserId(userId: string): Promise<responceUserData[]> {
  const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
  const user = result.docs.map((item) => ({
    ...(item.data() as responceUserData),
    docId: item.id,
  }));
  return user;
}

// firestoreからwhereを使用して、比較する配列が10個以上の場合にドキュメントを取得する関数
// おすすめのユーザー用
export async function getDocumentByArrays(
  arr: string[],
  getQuery: firebaseApp.firestore.Query<firebaseApp.firestore.DocumentData>
): Promise<responceUserData[]> {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    if (!arr) return resolve([]);

    const spliceArr = [...arr];
    const batches: responceUserData[][] = [];

    while (spliceArr.length) {
      const batch = spliceArr.splice(0, 10);

      batches.push(
        // eslint-disable-next-line no-shadow
        new Promise<responceUserData[]>((resolve) => {
          // eslint-disable-next-line no-void
          void getQuery(batch)
            .get()
            .then((results) => {
              const profiles: responceUserData[] = results.docs.map((result) => ({
                ...(result.data() as responceUserData),
                docId: result.id,
              }));
              const modifyProfiles = profiles.filter((profile) => !arr.includes(profile.userId));
              resolve(modifyProfiles);
            });
        })
      );
    }

    // eslint-disable-next-line no-void
    void Promise.all(batches).then((content): void => {
      const stackArr: string[] = [];
      const duplicatedDeleteArr = content.flat().filter((e) => {
        if (stackArr.indexOf(e.userId) === -1) {
          stackArr.push(e.userId);
          return true;
        }
        return false;
      });
      resolve(duplicatedDeleteArr);
    });
  });
}

// firestoreからwhereを使用して、比較する配列が10個以上の場合にドキュメントを取得する関数
// whereでINを使用しているドキュメントの取得
export async function getDocumentByArraysIn(
  arr: string[],
  getQuery: firebaseApp.firestore.Query<firebaseApp.firestore.DocumentData>
): Promise<responceBothData[]> {
  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    if (!arr) return resolve([]);

    const spliceArr = [...arr];
    const batches: responceUserData[][] = [];

    while (spliceArr.length) {
      const batch = spliceArr.splice(0, 10);

      batches.push(
        // eslint-disable-next-line no-shadow
        new Promise((resolve) => {
          // eslint-disable-next-line no-void
          void getQuery(batch)
            .get()
            .then((results) => {
              const profiles = results.docs.map((result) => ({
                ...result.data(),
                docId: result.id,
              }));
              resolve(profiles);
            });
        })
      );
    }

    // eslint-disable-next-line no-void
    void Promise.all(batches).then((content) => resolve(content.flat()));
  });
}

// おすすめのユーザーを取得
export async function getSuggestedProfiles(userId: string, following: string[], maker: string): Promise<responceUserData[]> {
  const collectionPath = firebase.firestore().collection('users');
  let result;
  let profiles;

  if (following.length > 0) {
    const ids = [...following, userId];

    if (ids.length > 10) {
      const getQuery = (batch: string[]) => collectionPath.where('userId', 'not-in', batch).where('maker', '==', maker).limit(100);
      profiles = await getDocumentByArrays(ids, getQuery);
    } else {
      result = await collectionPath
        .where('userId', 'not-in', [...following, userId])
        .where('maker', '==', maker)
        .limit(15)
        .get();

      profiles = result.docs.map((user) => ({
        ...(user.data() as responceUserData),
        docId: user.id,
      }));
    }
  } else {
    result = await collectionPath.where('userId', '!=', userId).where('maker', '==', maker).limit(15).get();

    profiles = result.docs.map((user) => ({
      ...(user.data() as responceUserData),
      docId: user.id,
    }));
  }

  const gettedProfileIds = profiles.map((user) => user.userId);

  if (profiles.length < 15) {
    let addIds;
    let addProfiles;
    if (following.length > 0) {
      addIds = [...following, userId, ...gettedProfileIds];
      const getQuery = (batch: string[]) => collectionPath.where('userId', 'not-in', batch).limit(100);
      addProfiles = await getDocumentByArrays(addIds, getQuery);
    } else {
      addIds = [userId, ...gettedProfileIds];
      const getQuery = (batch: string[]) => collectionPath.where('userId', 'not-in', batch).limit(100);
      addProfiles = await getDocumentByArrays(addIds, getQuery);
    }
    addProfiles.slice(0, result || result !== undefined ? 15 - result.docs.length : 0);
    const sumProfiles = [...addProfiles, ...profiles];
    sumProfiles.sort((a, b) => b.dateCreated - a.dateCreated);

    return sumProfiles;
    // eslint-disable-next-line no-else-return
  } else {
    profiles.slice(0, 15);
    return profiles;
  }
}

// ログインしているユーザーのフォローしている人を更新
export async function updateLoggedInUserFollowing(loggedInUserDocId: string, profileId: string, isFollowingProfile: boolean): Promise<void> {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile ? FieldValue.arrayRemove(profileId) : FieldValue.arrayUnion(profileId),
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      alert(error.message);
    });
}

// ログインしているユーザーのフォロワーを更新
export async function updateFollowedUserFollowers(profileDocId: string, loggedInUserDocId: string, isFollowingProfile: boolean): Promise<void> {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile ? FieldValue.arrayRemove(loggedInUserDocId) : FieldValue.arrayUnion(loggedInUserDocId),
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      alert(error.message);
    });
}

// ログインしているユーザーがフォローしている人のポストを取得
export async function getPhotos(userId: string, following: string[]): Promise<responceUserDataWithUserInfo[]> {
  if (following && following.length > 0) {
    const collectionPath = firebase.firestore().collection('photos');
    const getQuery = (batch: string[]) => collectionPath.where('userId', 'in', batch);
    const userFollowedPhotos = await getDocumentByArraysIn(following, getQuery);

    const photosWithUserDetails = await Promise.all(
      userFollowedPhotos.map(async (photo) => {
        let userLikedPhoto = false;
        if (photo.likes.includes(userId)) {
          userLikedPhoto = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const user = await getUserByUserId(photo.userId);
        const { username } = user[0];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return { username, ...photo, userLikedPhoto };
      })
    );

    return photosWithUserDetails;
  }
  return [];
}

// ログインしているユーザーがお気に入りしているポストを取得
export async function getPhotosFavorite(userId: string, likes: string[]): Promise<Promise<responceUserDataWithUserInfo[]>> {
  let likesPhotos: responcePhotoData[];

  await Promise.all(likes.map((docId) => firebase.firestore().collection('photos').doc(docId).get())).then((docs) => {
    likesPhotos = docs
      .filter((doc) => !!doc.data())
      .map((doc) => ({
        ...(doc.data() as responcePhotoData),
        docId: doc.id,
      }));
  });

  const photosWithUserDetails = await Promise.all(
    likesPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }

      const user = await getUserByUserId(photo.userId);

      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

// すべてのポストを取得
export async function getPhotosAll(userId: string, latestDoc: string): Promise<responceUserDataWithUserInfoLastDoc[]> {
  let result;

  if (latestDoc) {
    result = await firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated', 'desc')
      .startAfter(latestDoc || 0)
      .limit(6)
      .get();
  } else {
    result = await firebase.firestore().collection('photos').orderBy('dateCreated', 'desc').limit(6).get();
  }

  const lastDoc = result ? result.docs[result.docs.length - 1] : undefined;

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...(photo.data() as responcePhotoData),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return { ...photosWithUserDetails, ...lastDoc };
}

// ユーザーIDによってポストを取得
export async function getUserPhotosByUserId(userId: string): Promise<responceUserDataWithUserInfoLastDoc[] | null> {
  if (userId) {
    const result = await firebase.firestore().collection('photos').where('userId', '==', userId).get();

    const userPhotos = result.docs.map((photo) => ({
      ...(photo.data() as responcePhotoData),
      docId: photo.id,
    }));

    const photosWithUserDetails = await Promise.all(
      userPhotos.map(async (photo) => {
        let userLikedPhoto = false;
        if (photo.likes.includes(userId)) {
          userLikedPhoto = true;
        }

        const user = await getUserByUserId(photo.userId);

        const { username } = user[0];
        return { username, ...photo, userLikedPhoto };
      })
    );

    return photosWithUserDetails;
  }
  return null;
}

// ユーザーをフォローしているかをチェック
export async function isUserFollowingProfile(loggedInUserUsername: string, profileUserId: string): Promise<string> {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername) // karl (active logged in user)
    .where('following', 'array-contains', profileUserId)
    .get();
  const [response] = result.docs.map((item) => ({
    ...(item.data() as responceUserData),
    docId: item.id,
  }));

  return response.userId;
}

// フォローとフォローの解除
export async function toggleFollow(
  isFollowingProfile: boolean,
  activeUserDocId: string,
  profileDocId: string,
  profileUserId: string,
  followingUserId: string
): Promise<void> {
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}

// フォローしている人のuserドキュメントを取得
export async function getProfileFollowingUsers(following: string[]): Promise<responceBothData[]> {
  let users: responceBothData[] = [];
  if (following.length > 0) {
    const collectionPath = firebase.firestore().collection('users');
    const getQuery = (batch: string[]) => collectionPath.where('userId', 'in', batch);
    users = await getDocumentByArraysIn(following, getQuery);
  }

  return users;
}
// フォローされている人のuserドキュメントを取得
export async function getProfileFollowedgUsers(followed: string[]): Promise<responceBothData[]> {
  let users: responceBothData[] = [];

  if (followed.length > 0) {
    const collectionPath = firebase.firestore().collection('users');
    const getQuery = (batch) => collectionPath.where('userId', 'in', batch);
    users = await getDocumentByArraysIn(followed, getQuery);
  }

  return users;
}
