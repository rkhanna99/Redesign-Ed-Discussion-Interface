import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ConnectionRequest {
  name: string;
  requestedAt: string;
}

interface Connection {
  name: string;
  course: string;
  connectedAt: string;
  note: string;
}

interface DirectMessage {
  id: string;
  participant: string;
  text: string;
  sentAt: string;
  fromSelf: boolean;
}

interface PeerConnectionsValue {
  connections: Connection[];
  requests: ConnectionRequest[];
  directMessages: DirectMessage[];
  isConnected: (name: string) => boolean;
  hasRequestedConnection: (name: string) => boolean;
  disconnectConnection: (name: string) => void;
  sendConnectionRequest: (name: string) => void;
  sendDirectMessage: (to: string, text: string) => void;
  receiveDirectMessage: (from: string, text: string) => void;
}

const STORAGE_KEY = "ed-discussion-peer-connections";

const DEFAULT_CONNECTIONS: Connection[] = [
  {
    name: "Sarah Chen",
    course: "CS6750",
    connectedAt: "Apr 18, 9:20 AM",
    note: "Product design and peer feedback",
  },
  {
    name: "Kevin Tran",
    course: "CS7646",
    connectedAt: "Apr 20, 6:05 PM",
    note: "ML4T experiments and quant recruiting",
  },
  {
    name: "Chris Brooks",
    course: "CS6200",
    connectedAt: "Apr 22, 8:40 PM",
    note: "Systems work and infrastructure paths",
  },
];

const DEFAULT_DIRECT_MESSAGES: DirectMessage[] = [
  {
    id: "seed-sarah-chen-networking",
    participant: "Sarah Chen",
    text: "Hi Sarah, I liked your perspective on peer feedback in HCI. I am trying to meet more classmates working in product or UX, and would be glad to stay in touch.",
    sentAt: "Apr 23, 7:42 PM",
    fromSelf: true,
  },
  {
    id: "seed-sarah-chen-reply",
    participant: "Sarah Chen",
    text: "Thanks Rahul. I am definitely open to that. I have also been trying to meet more OMSCS students who care about community design.",
    sentAt: "Apr 23, 8:06 PM",
    fromSelf: false,
  },
  {
    id: "seed-sarah-chen-follow-up",
    participant: "Sarah Chen",
    text: "Nice. I have been hoping to meet people who think about product communities in a more intentional way.",
    sentAt: "Apr 23, 8:19 PM",
    fromSelf: true,
  },
  {
    id: "seed-sarah-chen-follow-up-reply",
    participant: "Sarah Chen",
    text: "Same here. If you ever want to compare notes on internship paths or portfolio framing, feel free to message me.",
    sentAt: "Apr 23, 8:31 PM",
    fromSelf: false,
  },
  {
    id: "seed-kevin-tran-networking",
    participant: "Kevin Tran",
    text: "Hey Kevin, your ML4T project updates were sharp. I am interested in networking with people exploring data and quant-adjacent roles this semester.",
    sentAt: "Apr 24, 5:18 PM",
    fromSelf: true,
  },
  {
    id: "seed-kevin-tran-reply",
    participant: "Kevin Tran",
    text: "Appreciate it. I would be glad to connect. I have been talking with a few classmates about trading systems and interview prep too.",
    sentAt: "Apr 24, 6:01 PM",
    fromSelf: false,
  },
  {
    id: "seed-kevin-tran-follow-up",
    participant: "Kevin Tran",
    text: "That is exactly the kind of circle I am looking for. I have mostly been trying to learn from people who are deeper into ML workflows.",
    sentAt: "Apr 24, 6:15 PM",
    fromSelf: true,
  },
  {
    id: "seed-kevin-tran-follow-up-reply",
    participant: "Kevin Tran",
    text: "Happy to share what has helped. A few of us have been trading notes on experiment tracking and recruiting timelines.",
    sentAt: "Apr 24, 6:28 PM",
    fromSelf: false,
  },
  {
    id: "seed-chris-brooks-networking",
    participant: "Chris Brooks",
    text: "Hi Chris, I saw your systems background and wanted to connect. I would enjoy swapping notes on infrastructure-oriented engineering roles when you have time.",
    sentAt: "Apr 25, 8:11 PM",
    fromSelf: true,
  },
  {
    id: "seed-chris-brooks-reply",
    participant: "Chris Brooks",
    text: "That sounds good. I am always up for comparing notes on backend and systems paths, especially with other students balancing work and OMSCS.",
    sentAt: "Apr 25, 8:44 PM",
    fromSelf: false,
  },
  {
    id: "seed-chris-brooks-follow-up",
    participant: "Chris Brooks",
    text: "Same here. I have been trying to build more relationships with students interested in distributed systems and platform work.",
    sentAt: "Apr 25, 8:56 PM",
    fromSelf: true,
  },
  {
    id: "seed-chris-brooks-follow-up-reply",
    participant: "Chris Brooks",
    text: "You should stay in touch then. I have found the OMSCS network useful for learning how people are positioning themselves for those roles.",
    sentAt: "Apr 25, 9:09 PM",
    fromSelf: false,
  },
];

function mergeSeededMessages(messages: DirectMessage[]) {
  const messageMap = new Map(messages.map((message) => [message.id, message]));

  for (const seededMessage of DEFAULT_DIRECT_MESSAGES) {
    if (!messageMap.has(seededMessage.id)) {
      messageMap.set(seededMessage.id, seededMessage);
    }
  }

  return Array.from(messageMap.values()).sort((left, right) => left.sentAt.localeCompare(right.sentAt));
}

const PeerConnectionsContext = createContext<PeerConnectionsValue | null>(null);

function nowLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function loadStoredState() {
  if (typeof window === "undefined") {
    return {
      connections: DEFAULT_CONNECTIONS,
      requests: [] as ConnectionRequest[],
      directMessages: DEFAULT_DIRECT_MESSAGES,
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        connections: DEFAULT_CONNECTIONS,
        requests: [],
        directMessages: DEFAULT_DIRECT_MESSAGES,
      };
    }

    const parsed = JSON.parse(raw) as {
      connections?: Connection[];
      requests?: ConnectionRequest[];
      directMessages?: DirectMessage[];
      sentMessages?: Array<{
        id: string;
        to: string;
        text: string;
        sentAt: string;
      }>;
    };

    const migratedDirectMessages = parsed.directMessages
      ?? parsed.sentMessages?.map((message) => ({
        id: message.id,
        participant: message.to,
        text: message.text,
        sentAt: message.sentAt,
        fromSelf: true,
      }))
      ?? DEFAULT_DIRECT_MESSAGES;

    return {
      connections: parsed.connections ?? DEFAULT_CONNECTIONS,
      requests: parsed.requests || [],
      directMessages: mergeSeededMessages(migratedDirectMessages),
    };
  } catch {
    return {
      connections: DEFAULT_CONNECTIONS,
      requests: [],
      directMessages: mergeSeededMessages(DEFAULT_DIRECT_MESSAGES),
    };
  }
}

export function PeerConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<Connection[]>(() => loadStoredState().connections);
  const [requests, setRequests] = useState<ConnectionRequest[]>(() => loadStoredState().requests);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => loadStoredState().directMessages);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ connections, requests, directMessages }));
  }, [connections, requests, directMessages]);

  const isConnected = (name: string) => connections.some((connection) => connection.name === name);
  const hasRequestedConnection = (name: string) => requests.some((request) => request.name === name);

  const disconnectConnection = (name: string) => {
    setConnections((current) => current.filter((connection) => connection.name !== name));
  };

  const sendConnectionRequest = (name: string) => {
    setRequests((current) => {
      if (current.some((request) => request.name === name)) return current;
      return [{ name, requestedAt: nowLabel() }, ...current];
    });
  };

  const sendDirectMessage = (to: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setDirectMessages((current) => [
      ...current,
      {
        id: `${to}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        participant: to,
        text: trimmedText,
        sentAt: nowLabel(),
        fromSelf: true,
      },
    ]);
  };

  const receiveDirectMessage = (from: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setDirectMessages((current) => [
      ...current,
      {
        id: `${from}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        participant: from,
        text: trimmedText,
        sentAt: nowLabel(),
        fromSelf: false,
      },
    ]);
  };

  return (
    <PeerConnectionsContext.Provider
      value={{
        connections,
        requests,
        directMessages,
        isConnected,
        hasRequestedConnection,
        disconnectConnection,
        sendConnectionRequest,
        sendDirectMessage,
        receiveDirectMessage,
      }}
    >
      {children}
    </PeerConnectionsContext.Provider>
  );
}

export function usePeerConnections() {
  const ctx = useContext(PeerConnectionsContext);
  if (!ctx) throw new Error("usePeerConnections must be used inside PeerConnectionsProvider");
  return ctx;
}
