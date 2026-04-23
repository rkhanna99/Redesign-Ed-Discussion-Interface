import { X } from "lucide-react";
import { usePeerVisibility } from "./PeerVisibilityContext";
import { PeerLabelType, labelDescriptions, labelStyles } from "./peerData";

interface Props {
  open: boolean;
  onClose: () => void;
}

const order: PeerLabelType[] = [
  "team_project",
  "shared_course",
  "book_club",
  "shared_location",
  "previously_interacted",
];

export function PeerVisibilitySettings({ open, onClose }: Props) {
  const { visible, toggle } = usePeerVisibility();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="w-[420px] bg-white rounded-xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900" style={{ fontSize: 16, fontWeight: 600 }}>My Peer Visibility Settings</h2>
            <p className="text-xs text-gray-500 mt-1" style={{ lineHeight: 1.5 }}>
              Choose which peer context cues you want to see next to classmate names.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-1.5">
          {order.map((type) => {
            const on = visible[type];
            return (
              <label
                key={type}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(type)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4a2e8a] focus:ring-[#4a2e8a]"
                />
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${labelStyles[type]}`} style={{ fontWeight: 500, lineHeight: 1.2 }}>
                  {labelDescriptions[type]}
                </span>
                <span className="ml-auto text-[11px] text-gray-400">
                  {on ? "Shown" : "Hidden"}
                </span>
              </label>
            );
          })}
        </div>

        <div className="px-5 py-3 bg-gray-50 rounded-b-xl text-[11px] text-gray-500 border-t border-gray-100">
          These preferences only change what you see. Other classmates control their own labels.
        </div>
      </div>
    </div>
  );
}
