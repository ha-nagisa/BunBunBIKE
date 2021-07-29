/* eslint-disable no-nested-ternary */

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Skeleton from 'react-loading-skeleton';
import MobileSuggestedProfile from './mobile-suggested-profile';
import useWindowDimensions from '../../../../hooks/use-window-dimensions';
import { selectSuggestionProfiles } from '../../../../store/slices/suggestionProfilesSlice';
import { selectLoggedInUser } from '../../../../store/slices/loggedInUserSlice';

const MobileSidebarSuggestions: React.FC = () => {
  const profiles = useSelector(selectSuggestionProfiles);
  const user = useSelector(selectLoggedInUser);

  const settings = useMemo(
    () => ({
      infinite: true,
      speed: 500,
      slidesToShow: 4.5,
      slidesToScroll: 2,
      responsive: [
        {
          breakpoint: 780,
          settings: {
            slidesToShow: 3.5,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 2,
          },
        },
      ],
    }),
    []
  );

  // おすすめのユーザーが少ない場合にスライドのレイアウト崩れを防ぐための真偽値
  const { width } = useWindowDimensions();
  const [isSliderOn, setIsSliderOn] = useState(true);

  useEffect(() => {
    if (width < 1024 && width > 780) {
      setIsSliderOn(settings.slidesToShow < profiles?.length);
    } else if (width < 780 && width > 540) {
      setIsSliderOn(settings.responsive[0].settings.slidesToShow < profiles?.length);
    } else if (width < 540) {
      setIsSliderOn(settings.responsive[1].settings.slidesToShow < profiles?.length);
    }
  }, [width, profiles, settings]);

  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="mt-4">
      {isSliderOn ? (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Slider {...settings}>
          {profiles.map((profile) => (
            <MobileSuggestedProfile
              key={profile.docId}
              profileDocId={profile.docId as string}
              username={profile.username}
              profileId={profile.userId}
              userId={user.userId}
              loggedInUserDocId={user.docId as string}
              profileImageUrl={profile.bikeImageUrl}
            />
          ))}
        </Slider>
      ) : (
        <div className="flex">
          {' '}
          {profiles.map((profile) => (
            <MobileSuggestedProfile
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
      )}
    </div>
  ) : null;
};

export default MobileSidebarSuggestions;
