import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, Send, UserRoundCheck, UsersRound, X } from "lucide-react";

import { CURRENT_USER } from "../data/threads";
import { usePeerConnections } from "../peer/PeerConnectionsContext";
import { PeerProfileTrigger } from "../peer/PeerName";
import { usePeerProfiles } from "../peer/PeerProfilesContext";

interface ConnectionsHubProps {
  onBack: () => void;
}

const autoReplyByParticipant: Record<string, string[]> = {
  "Sarah Chen": [
    "That sounds good. I am usually happy to compare notes on HCI projects and product roles.",
    "I would be up for that. I have been trying to meet more people thinking about community and UX too.",
    "Works for me. It is always useful meeting classmates who are intentional about design and community work.",
  ],
  "Kevin Tran": [
    "Makes sense. I can share what has been useful for me in ML4T and quant-focused prep.",
    "Happy to keep the thread going. I have been collecting a few solid ML4T experiment workflows this term.",
    "Definitely. I have met a few people through the class who are also aiming for data-heavy engineering roles.",
  ],
  "Chris Brooks": [
    "Definitely. I am always interested in talking with other students about systems and infrastructure paths.",
    "Sounds good. Backend and distributed systems is an area I am still exploring more deeply too.",
    "I am into that. It helps having other OMSCS students to compare notes with on platform and systems work.",
  ],
};

export function ConnectionsHub({ onBack }: ConnectionsHubProps) {
  const { connections, requests, directMessages, sendDirectMessage, receiveDirectMessage } = usePeerConnections();
  const { profiles } = usePeerProfiles();
  const [selectedConnectionName, setSelectedConnectionName] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const messageScrollRef = useRef<HTMLDivElement | null>(null);

  const nameButtonClassName = "bg-transparent p-0 text-left text-sm text-gray-900 transition-colors hover:text-[#4a2e8a] hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2e8a]";
  const selectedConnection = connections.find((connection) => connection.name === selectedConnectionName) || null;
  const selectedProfile = selectedConnection ? profiles[selectedConnection.name] : undefined;
  const currentUserProfile = profiles[CURRENT_USER];
  const orderedConnections = useMemo(() => {
    const latestMessageIndexByParticipant = new Map<string, number>();

    directMessages.forEach((message, index) => {
      latestMessageIndexByParticipant.set(message.participant, index);
    });

    return [...connections]
      .map((connection, index) => ({
        connection,
        originalIndex: index,
        latestMessageIndex: latestMessageIndexByParticipant.get(connection.name) ?? -1,
      }))
      .sort((left, right) => {
        if (right.latestMessageIndex !== left.latestMessageIndex) {
          return right.latestMessageIndex - left.latestMessageIndex;
        }
        return left.originalIndex - right.originalIndex;
      })
      .map((entry) => entry.connection);
  }, [connections, directMessages]);
  const selectedMessages = useMemo(() => {
    if (!selectedConnectionName) return [];
    return directMessages.filter((message) => message.participant === selectedConnectionName);
  }, [directMessages, selectedConnectionName]);

  useEffect(() => {
    if (selectedConnectionName && !connections.some((connection) => connection.name === selectedConnectionName)) {
      setSelectedConnectionName(null);
    }
  }, [connections, selectedConnectionName]);

  useEffect(() => {
    setDraftMessage("");
  }, [selectedConnectionName]);

  useEffect(() => {
    if (!messageScrollRef.current) return;
    messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight;
  }, [selectedMessages]);

  const handleSendFromPanel = () => {
    if (!selectedConnectionName) return;

    const trimmed = draftMessage.trim();
    if (!trimmed) return;

    sendDirectMessage(selectedConnectionName, trimmed);
    setDraftMessage("");

    const cannedReplies = autoReplyByParticipant[selectedConnectionName];
    if (!cannedReplies || cannedReplies.length === 0) return;

    const selfMessagesInThread = selectedMessages.filter((message) => message.fromSelf).length;
    const reply = cannedReplies[selfMessagesInThread % cannedReplies.length];
    window.setTimeout(() => {
      receiveDirectMessage(selectedConnectionName, reply);
    }, 500);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#fcfbff]">
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 rounded-lg border border-[#eadff7] bg-white px-3 py-2 text-sm text-[#4a2e8a] shadow-sm transition-colors hover:bg-[#f7f3fe]"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7b68a8]" style={{ fontWeight: 700 }}>
              Connections
            </p>
            <h1 className="mt-2 text-3xl text-gray-900" style={{ fontWeight: 600 }}>
              Connections and Messages
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Keep track of who you are connected with, the requests you have sent, and the networking conversations you have started.
            </p>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[#eadff7] bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400" style={{ fontWeight: 700 }}>
                Connections
              </p>
              <p className="mt-2 text-3xl text-[#4a2e8a]" style={{ fontWeight: 700 }}>{connections.length}</p>
            </div>
            <div className="rounded-2xl border border-[#eadff7] bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400" style={{ fontWeight: 700 }}>
                Requests Sent
              </p>
              <p className="mt-2 text-3xl text-[#4a2e8a]" style={{ fontWeight: 700 }}>{requests.length}</p>
            </div>
            <div className="rounded-2xl border border-[#eadff7] bg-white px-5 py-4 text-center shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400" style={{ fontWeight: 700 }}>
                Unread Messages
              </p>
              <p className="mt-2 text-3xl text-[#4a2e8a]" style={{ fontWeight: 700 }}>0</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="flex h-[calc(100vh-13rem)] flex-col gap-6">
            <section className="flex min-h-0 flex-[1.15] flex-col overflow-hidden rounded-2xl border border-[#eadff7] bg-white shadow-sm">
              <div className="border-b border-[#f0e9fb] px-5 py-4">
                <div className="flex items-center gap-2 text-[#4a2e8a]">
                  <UsersRound size={16} />
                  <h2 className="text-base text-gray-900" style={{ fontWeight: 600 }}>Your Connections</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">Classmates you are already connected with across your courses.</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
                {orderedConnections.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                    No connections yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orderedConnections.map((connection) => {
                      const profile = profiles[connection.name];
                      const avatar = profile?.avatar || connection.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
                      const avatarColor = profile?.avatarColor || "bg-slate-600";

                      return (
                        <div
                          key={connection.name}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedConnectionName(connection.name)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedConnectionName(connection.name);
                            }
                          }}
                          className={`overflow-hidden rounded-xl border px-4 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2e8a] ${
                            selectedConnectionName === connection.name
                              ? "border-[#cdb8ef] bg-[#f7f3fe] shadow-sm"
                              : "border-gray-100 bg-[#fcfbff] hover:border-[#e0d2f5] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="mb-2 flex items-center gap-3">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs text-white ${avatarColor}`} style={{ fontWeight: 700 }}>
                                  {avatar}
                                </div>
                                <div className="min-w-0">
                                  <PeerProfileTrigger
                                    name={connection.name}
                                    buttonClassName={nameButtonClassName}
                                    showPreview
                                    stopPropagation
                                  >
                                    <span style={{ fontWeight: 600 }}>{connection.name}</span>
                                  </PeerProfileTrigger>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {connection.course} - Connected {connection.connectedAt}
                                  </p>
                                </div>
                              </div>
                              <p className="break-words text-sm text-gray-600">{connection.note}</p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] text-emerald-700">
                              <UserRoundCheck size={11} />
                              Connected
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            <section className="flex min-h-0 flex-[0.85] flex-col overflow-hidden rounded-2xl border border-[#eadff7] bg-white shadow-sm">
              <div className="border-b border-[#f0e9fb] px-5 py-4">
                <div className="flex items-center gap-2 text-[#4a2e8a]">
                  <UserRoundCheck size={16} />
                  <h3 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>Pending Requests</h3>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-4">
                {requests.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                    No connection requests sent yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((request) => (
                      <div key={request.name} className="overflow-hidden rounded-xl border border-gray-100 bg-[#fcfbff] px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <PeerProfileTrigger
                              name={request.name}
                              buttonClassName={nameButtonClassName}
                              showPreview
                            >
                              <span style={{ fontWeight: 600 }}>{request.name}</span>
                            </PeerProfileTrigger>
                            <p className="mt-1 text-xs text-gray-500">Request sent {request.requestedAt}</p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] text-amber-700">
                            Pending
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="h-[calc(100vh-13rem)] overflow-hidden rounded-2xl border border-[#eadff7] bg-white shadow-sm">
            {selectedConnection && selectedProfile ? (
              <div className="flex h-full min-h-[36rem] flex-col">
                <div className="border-b border-[#f0e9fb] bg-[#fcfbff] px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm text-white ${selectedProfile.avatarColor}`} style={{ fontWeight: 700 }}>
                        {selectedProfile.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[#4a2e8a]">
                          <MessageCircle size={16} />
                          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ fontWeight: 700 }}>
                            Direct Messages
                          </p>
                        </div>
                        <PeerProfileTrigger
                          name={selectedConnection.name}
                          buttonClassName="mt-1 bg-transparent p-0 text-left text-lg text-gray-900 transition-colors hover:text-[#4a2e8a] hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2e8a]"
                          showPreview
                        >
                          <span style={{ fontWeight: 600 }}>{selectedConnection.name}</span>
                        </PeerProfileTrigger>
                        <p className="mt-1 text-sm text-gray-500">
                          {selectedConnection.course} - {selectedConnection.note}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedConnectionName(null)}
                      title="Close conversation"
                      className="inline-flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-[#f4effd] hover:text-[#4a2e8a]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div ref={messageScrollRef} className="min-h-0 flex-1 overflow-y-auto bg-[#f8f5fd] px-5 py-5">
                  <div className="space-y-4">
                    {selectedMessages.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#d9cdee] bg-white px-4 py-6 text-sm text-gray-500">
                        No direct messages with {selectedConnection.name} yet.
                      </div>
                    ) : (
                      selectedMessages.map((message) => {
                        const isSelf = message.fromSelf;
                        const avatarClassName = isSelf
                          ? currentUserProfile?.avatarColor || "bg-orange-500"
                          : selectedProfile.avatarColor;
                        const avatarText = isSelf
                          ? currentUserProfile?.avatar || "RK"
                          : selectedProfile.avatar;

                        return (
                          <article
                            key={message.id}
                            className={`flex gap-3 ${isSelf ? "justify-end" : "justify-start"}`}
                          >
                            {!isSelf && (
                              <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] text-white ${avatarClassName}`} style={{ fontWeight: 700 }}>
                                {avatarText}
                              </div>
                            )}
                            <div className={`flex max-w-[78%] flex-col ${isSelf ? "items-end" : "items-start"}`}>
                              <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                                <span style={{ fontWeight: 600 }}>{isSelf ? currentUserProfile?.name || "Rahul Khanna" : selectedConnection.name}</span>
                                <span>{message.sentAt}</span>
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                  isSelf
                                    ? "rounded-tr-md bg-[#4a2e8a] text-white"
                                    : "rounded-tl-md border border-[#eadff7] bg-white text-gray-700"
                                }`}
                              >
                                {message.text}
                              </div>
                            </div>
                            {isSelf && (
                              <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] text-white ${avatarClassName}`} style={{ fontWeight: 700 }}>
                                {avatarText}
                              </div>
                            )}
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="border-t border-[#f0e9fb] bg-white px-5 py-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                        Reply
                      </label>
                      <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSendFromPanel();
                          }
                        }}
                        placeholder={`Message ${selectedConnection.name}`}
                        className="min-h-24 w-full resize-none rounded-xl border border-[#e7ddf5] bg-[#fcfbff] px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a2e8a] focus:ring-2 focus:ring-[#4a2e8a]/10"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendFromPanel}
                      disabled={!draftMessage.trim()}
                      className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm transition-colors ${
                        draftMessage.trim()
                          ? "bg-[#4a2e8a] text-white hover:bg-[#3d2574]"
                          : "cursor-not-allowed bg-[#ede7f8] text-[#9b8aba]"
                      }`}
                    >
                      <Send size={15} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-[#fcfbff] px-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4effd] text-[#4a2e8a]">
                  <MessageCircle size={24} />
                </div>
                <h2 className="mt-5 text-xl text-gray-900" style={{ fontWeight: 600 }}>
                  Direct message history
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Select one of your connected classmates on the left to open a Slack-style conversation view with your shared chat history.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
