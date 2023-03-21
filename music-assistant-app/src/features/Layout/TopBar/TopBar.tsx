import { IconButton } from "components/IconButton";
import React, { useState } from "react";
import { buildCssClass } from "utils/css/builders";

import styles from "./TopBar.module.scss";
import { RelativeContentBox } from "components/RelativeContentBox";
import { BsQuestionLg } from "react-icons/bs";
import { commands } from "commands/commands";
import { CommandHelpDisplayer } from 'features/CommandHelpDisplayer';

export type TopBarProps = {};

export const TopBar = (props: TopBarProps) => {
  const conatinerClassObj = {
    [styles.container]: true,
  };

  return (
    <div>
      <div className={buildCssClass(conatinerClassObj)}>
        <div>
          <RelativeContentBox
            positioning="Bottom"
            alignment="End"
            buttonComponent={IconButton}
            buttonContent={<BsQuestionLg />}
          >
            <CommandHelpDisplayer/>
          </RelativeContentBox>
        </div>
      </div>
    </div>
  );
};

TopBar.defaultProps = {};

export default TopBar;
