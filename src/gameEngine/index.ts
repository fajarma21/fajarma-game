import dayjs from 'dayjs';
import { getLS, setLS } from 'fajarma-package';
import type { GameObj } from 'kaplay';
import kaplay from 'kaplay';

import { ID_BED, ID_CLOCK, ID_PHOTO } from '@/constants';

import { LS_VISIT } from './index.constants';
import type { InitGameParams } from './index.types';
import environmentObj from './modules/environment';
import itemObj from './modules/item';
import loadingObj from './modules/loading';
import playerObj from './modules/player';
import spritesObj from './modules/sprites';
import textObj from './modules/text';

const initGame = ({ width, height, canvas, handleAction }: InitGameParams) => {
  let activeItems: GameObj[] = [];
  let latestItem: GameObj | undefined;
  const secondVisit = getLS(LS_VISIT);

  const handleAddItem = (value: GameObj) => {
    activeItems.unshift(value);
  };

  const handleRemoveItem = (value: GameObj) => {
    activeItems = activeItems.filter(
      (item) => item.uniqueId !== value.uniqueId
    );
    description.text = '';
  };

  const k = kaplay({
    canvas,
    width,
    height,
    letterbox: true,
    global: false,
    background: [152, 231, 95],
    texFilter: 'linear',
  });

  loadingObj(k);

  spritesObj(k);
  const { top, bottom } = environmentObj(k);
  const game = top.add([k.z(4), k.timer()]);
  const { player } = playerObj({
    k,
    game,
    parent: top,
    handleAddItem,
    handleRemoveItem,
  });
  itemObj({ k, parent: top });

  k.onLoad(() => {
    let greet = '';
    if (secondVisit) greet = 'Welcome back!';
    else {
      setLS(LS_VISIT, true);
      greet = 'Welcome to my house!';
    }
    greetings.text =
      greet + '\nPlease make yourself comfortable.\n<use arrow keys to move>';
  });

  let spaceKey: GameObj;

  const { greetings, label, description } = textObj({ k, parent: bottom });

  k.onKeyPress('space', () => {
    if (activeItems.length) {
      const item = activeItems[0];
      if (!item.isText) {
        handleAction(item.uniqueId, game);
        game.paused = true;
      } else if (item.uniqueId === ID_CLOCK) {
        description.text = dayjs().format('hh:mm:ss A');
      } else if (item.uniqueId === ID_BED) {
        const currentTime = dayjs().hour();
        let text = '';
        if (currentTime <= 4) {
          text = "Why are you still up? Working? Let's continue tomorrow.";
        } else if (currentTime <= 7) {
          text =
            'I just woke up and immediately realized there was another morning person.';
        } else if (currentTime <= 12) {
          text = 'Seriously? at this time?';
        } else if (currentTime <= 14) {
          text = 'Still working.';
        } else if (currentTime <= 16) {
          text = "It's too late to take a nap.";
        } else if (currentTime <= 20) {
          text = 'Sleepy yet?';
        } else if (currentTime <= 23) {
          text = "I'll sleep after you.";
        }
        description.text = text;
      } else if (item.uniqueId === ID_PHOTO) {
        description.text = 'My family.';
      }
    }
  });

  k.onUpdate(() => {
    if (activeItems.length) {
      greetings.text = '';
      const newItem = activeItems[0];
      if (
        !latestItem ||
        (latestItem && latestItem.uniqueId !== newItem.uniqueId)
      ) {
        label.text = `${newItem.text}`;
        description.text = '';
        latestItem = newItem;
        if (!spaceKey || (spaceKey && !spaceKey.parent)) {
          spaceKey = player.add([
            k.pos(0, -130),
            k.rect(70, 30, { radius: 4 }),
            k.anchor('center'),
            k.color(k.WHITE),
            k.outline(2, k.rgb(196, 196, 196)),
            k.animate(),
          ]);
          spaceKey.add([
            k.text('SPACE', { size: 16 }),
            k.anchor('center'),
            k.color(k.BLACK),
          ]);
          spaceKey.animate('scale', [k.vec2(1), k.vec2(0.8), k.vec2(1)], {
            duration: 0.5,
          });
        }
      }
    } else {
      label.text = '';
      description.text = '';
      latestItem = undefined;
      if (spaceKey) spaceKey.destroy();
    }
  });

  // k.debug.inspect = true;
};

export default initGame;
