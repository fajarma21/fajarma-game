import profPic from '@/assets/profile_square_small.png';

import css from './View.module.scss';

const Picture = () => {
  return (
    <div className={css.imageWrapper}>
      <img
        src={profPic}
        alt="profile pic"
        width={200}
        height={200}
        className={css.profPic}
      />
    </div>
  );
};

export default Picture;
