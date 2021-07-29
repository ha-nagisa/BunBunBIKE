/* eslint-disable no-nested-ternary */

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../../../store/slices/loggedInUserSlice';
import { selectSuggestionProfiles } from '../../../../store/slices/suggestionProfilesSlice';
import SuggestedProfile from './suggested-profile';

const Suggestions: React.FC = () => {
  const profiles = useSelector(selectSuggestionProfiles);
  const user = useSelector(selectLoggedInUser);

  return !profiles ? (
    <Skeleton count={1} height={600} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">あなたにおすすめのユーザー</p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId as string}
            username={profile.username}
            profileId={profile.userId}
            userId={user.userId}
            loggedInUserDocId={user.docId as string}
            profileImageUrl={profile.bikeImageUrl}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Suggestions;
