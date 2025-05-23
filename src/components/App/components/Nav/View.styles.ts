import { css } from "@emotion/css";

export const container = css`
  padding: 8px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const title = css`
  margin-right: auto;
  h1 {
    position: relative;
    margin: 0;
    white-space: nowrap;

    & > span {
      transition: all 250ms;
      &:first-child {
        position: absolute;
        top: 0;
        opacity: 0.2;
      }
      &:last-child {
        overflow: hidden;
        display: block;
        width: 112px;
        & > span {
          display: inline-block;
          transition: inherit;
        }
      }
    }
    &:hover {
      & > span {
        &:first-child {
          opacity: 0;
        }
        &:last-child {
          width: 100%;
          text-transform: capitalize;
          & > span {
            margin-left: 8px;
          }
        }
      }
    }
  }
`;

export const menu = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 12px;
  &:hover {
    color: var(--accent);
  }
`;
