import firebaseApp from 'firebase';

export type responceUserData = {
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
};

export type responcePhotoData = {
  maker: string;
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
};

export interface responcePhotoDataWithUserInfo {
  maker: string;
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
  userLikedPhoto: boolean;
  username: string;
}

export interface responcePhotoDataWithUserInfoLastDoc {
  photosWithUserDetails: responcePhotoDataWithUserInfo[];
  lastDoc: firebaseApp.firestore.QueryDocumentSnapshot<firebaseApp.firestore.DocumentData> | undefined;
}

export type responceBothData = responceUserData | responcePhotoData;
