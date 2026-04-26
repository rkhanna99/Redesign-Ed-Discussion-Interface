import { useEffect, useState, type ReactNode } from "react";
import { BookOpen, Briefcase, Check, Clock, MapPin, MessageCircle, Sparkles, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { CURRENT_USER } from "../data/threads";
import { labelDescriptions, labelStyles, type PeerLabel, type PeerLabelType, type PeerProfile } from "./peerData";
import { usePeerProfiles } from "./PeerProfilesContext";
import { usePeerVisibility } from "./PeerVisibilityContext";

interface PeerNameProps {
  name: string;
  className?: string;
  showLabelsInline?: boolean;
  maxInlineLabels?: number;
}

interface PeerProfileTriggerProps {
  name: string;
  children: ReactNode;
  buttonClassName?: string;
  wrapperClassName?: string;
  showPreview?: boolean;
  stopPropagation?: boolean;
}

function pillClass(type: string) {
  return `text-[10px] px-1.5 py-[1px] rounded-full ${labelStyles[type as keyof typeof labelStyles] || "bg-slate-100 text-slate-600"}`;
}

function profileCourses(profile: PeerProfile) {
  if (profile.coursesTaken && profile.coursesTaken.length > 0) return profile.coursesTaken;
  return profile.labels
    .filter((label) => label.type === "shared_course")
    .map((label) => label.text.replace(/\s+(Spring|Summer|Fall)\s+\d{4}$/i, ""));
}

function profileSharedContext(profile: PeerProfile, visibleLabels: PeerLabel[]) {
  if (profile.sharedContext && profile.sharedContext.length > 0) return profile.sharedContext;
  return visibleLabels.map((label) => label.text);
}

function normalizeLocation(location?: string) {
  return (location || "").trim().toLowerCase();
}

function getVisibleLabels(
  profile: PeerProfile,
  currentUserProfile: PeerProfile | undefined,
  visible: Record<PeerLabelType, boolean>,
  isCurrentUser = false,
) {
  return profile.labels.filter((label) => {
    if (!visible[label.type]) return false;
    if (label.type !== "shared_location") return true;
    if (isCurrentUser) return false;

    const currentUserLocation = normalizeLocation(currentUserProfile?.location);
    const peerLocation = normalizeLocation(profile.location);
    if (!currentUserLocation || !peerLocation) return false;

    return currentUserLocation === peerLocation;
  });
}

const avatarColorOptions = [
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-emerald-600", label: "Emerald" },
  { value: "bg-amber-600", label: "Amber" },
  { value: "bg-rose-500", label: "Rose" },
  { value: "bg-indigo-600", label: "Indigo" },
  { value: "bg-purple-600", label: "Purple" },
  { value: "bg-teal-600", label: "Teal" },
  { value: "bg-pink-600", label: "Pink" },
  { value: "bg-sky-600", label: "Sky" },
  { value: "bg-violet-600", label: "Violet" },
  { value: "bg-slate-600", label: "Slate" },
  { value: "bg-gray-700", label: "Gray" },
];

const editableLabelTypes: PeerLabelType[] = [
  "team_project",
  "shared_course",
  "book_club",
  "shared_location",
  "previously_interacted",
];

const inputClassName = "mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a2e8a] focus:ring-2 focus:ring-[#4a2e8a]/15";

function normalizeList(items?: string[]) {
  return (items || []).map((item) => item.trim()).filter(Boolean);
}

function normalizeLabels(labels: PeerLabel[]) {
  return labels
    .map((label) => ({
      type: label.type,
      text: label.text.trim(),
    }))
    .filter((label) => label.text.length > 0);
}

function normalizeProfile(profile: PeerProfile): PeerProfile {
  return {
    ...profile,
    name: profile.name.trim(),
    avatar: profile.avatar.trim().toUpperCase().slice(0, 3),
    avatarColor: profile.avatarColor.trim() || "bg-orange-500",
    bio: profile.bio.trim(),
    location: profile.location?.trim() || "",
    coursesTaken: normalizeList(profile.coursesTaken),
    background: profile.background?.trim() || "",
    timezone: profile.timezone?.trim() || "",
    interests: normalizeList(profile.interests),
    labels: normalizeLabels(profile.labels),
  };
}

function profileSignature(profile: PeerProfile) {
  return JSON.stringify(normalizeProfile(profile));
}

function PeerPreviewCard({ profile, visibleLabels }: { profile: PeerProfile; visibleLabels: PeerLabel[] }) {
  return (
    <span className="pointer-events-none absolute left-0 top-full z-40 mt-1.5 opacity-0 transition-opacity group-hover:opacity-100">
      <span className="block w-72 rounded-lg border border-gray-200 bg-white p-3.5 shadow-lg">
        <span className="flex items-start gap-2.5">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${profile.avatarColor} text-xs text-white`} style={{ fontWeight: 600 }}>
            {profile.avatar}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm text-gray-900" style={{ fontWeight: 600 }}>
              {profile.name}
            </span>
            {profile.background && (
              <span className="block text-[11px] text-gray-500">{profile.background}</span>
            )}
          </span>
        </span>

        {visibleLabels.length > 0 && (
          <span className="mt-2.5 flex flex-wrap gap-1">
            {visibleLabels.map((label) => (
              <span
                key={label.type + label.text}
                className={pillClass(label.type)}
                style={{ fontWeight: 400, lineHeight: 1.2 }}
              >
                {label.text}
              </span>
            ))}
          </span>
        )}

        <span className="mt-2.5 block text-xs text-gray-600" style={{ lineHeight: 1.5 }}>
          {profile.bio}
        </span>

        <span className="mt-2.5 flex flex-col gap-1 text-[11px] text-gray-500">
          {profile.timezone && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} className="text-gray-400" />
              {profile.timezone}
            </span>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Sparkles size={11} className="text-gray-400" />
              {profile.interests.join(" / ")}
            </span>
          )}
          {profile.background && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={11} className="text-gray-400" />
              {profile.background}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

function CurrentUserProfilePanel({ profile }: { profile: PeerProfile }) {
  const { updateProfile } = usePeerProfiles();
  const [draft, setDraft] = useState<PeerProfile>(() => normalizeProfile(profile));

  useEffect(() => {
    setDraft(normalizeProfile(profile));
  }, [profile]);

  const normalizedDraft = normalizeProfile(draft);
  const hasChanges = profileSignature(normalizedDraft) !== profileSignature(profile);

  const setField = (field: keyof PeerProfile, value: string | string[] | PeerLabel[]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateLabel = (index: number, next: Partial<PeerLabel>) => {
    setDraft((current) => ({
      ...current,
      labels: current.labels.map((label, labelIndex) => (
        labelIndex === index ? { ...label, ...next } : label
      )),
    }));
  };

  const addLabel = () => {
    setDraft((current) => ({
      ...current,
      labels: [...current.labels, { type: "shared_course", text: "" }],
    }));
  };

  const removeLabel = (index: number) => {
    setDraft((current) => ({
      ...current,
      labels: current.labels.filter((_, labelIndex) => labelIndex !== index),
    }));
  };

  const saveProfile = () => {
    updateProfile(CURRENT_USER, normalizedDraft);
  };

  return (
    <DialogContent
      onClick={(event) => event.stopPropagation()}
      className="max-w-[22rem] gap-0 overflow-hidden rounded-xl border-gray-200 bg-white p-0 text-gray-800 shadow-2xl sm:max-w-[24rem]"
    >
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm text-white ${draft.avatarColor}`} style={{ fontWeight: 700 }}>
              {draft.avatar || "RK"}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base leading-5 text-gray-900">Edit Profile</DialogTitle>
            <DialogDescription className="mt-1 text-xs text-gray-500">
              Changes update your visible student profile after you save them.
            </DialogDescription>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Display Name
            </span>
            <input
              type="text"
              value={draft.name}
              onChange={(event) => setField("name", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Avatar Initials
            </span>
            <input
              type="text"
              maxLength={3}
              value={draft.avatar}
              onChange={(event) => setField("avatar", event.target.value.toUpperCase())}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Background
            </span>
            <input
              type="text"
              value={draft.background || ""}
              onChange={(event) => setField("background", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Avatar Color
            </span>
            <select
              value={draft.avatarColor}
              onChange={(event) => setField("avatarColor", event.target.value)}
              className={inputClassName}
            >
              {avatarColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              About
            </span>
            <textarea
              rows={4}
              value={draft.bio}
              onChange={(event) => setField("bio", event.target.value)}
              className={`${inputClassName} resize-none`}
            />
          </label>
        </div>

        <div className="mt-4 grid gap-3">
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Location
            </span>
            <input
              type="text"
              value={draft.location || ""}
              onChange={(event) => setField("location", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Courses Taken
            </span>
            <input
              type="text"
              value={(draft.coursesTaken || []).join(", ")}
              onChange={(event) => setField("coursesTaken", event.target.value.split(","))}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Timezone
            </span>
            <input
              type="text"
              value={draft.timezone || ""}
              onChange={(event) => setField("timezone", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="text-sm text-gray-700">
            <span className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
              Interests
            </span>
            <input
              type="text"
              value={(draft.interests || []).join(", ")}
              onChange={(event) => setField("interests", event.target.value.split(","))}
              className={inputClassName}
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                Profile Labels
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Add the labels you want associated with your profile. Visibility settings still apply.
              </p>
            </div>
            <button
              type="button"
              onClick={addLabel}
              className="shrink-0 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 transition-colors hover:bg-gray-100"
            >
              Add label
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {draft.labels.length === 0 && (
              <div className="rounded-md border border-dashed border-gray-200 bg-white px-3 py-2 text-xs text-gray-500">
                No labels added yet.
              </div>
            )}
            {draft.labels.map((label, index) => (
              <div key={`${label.type}-${index}`} className="grid gap-2 rounded-md border border-gray-200 bg-white p-2.5">
                <select
                  value={label.type}
                  onChange={(event) => updateLabel(index, { type: event.target.value as PeerLabelType })}
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a2e8a] focus:ring-2 focus:ring-[#4a2e8a]/15"
                >
                  {editableLabelTypes.map((type) => (
                    <option key={type} value={type}>
                      {labelDescriptions[type]}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={label.text}
                  onChange={(event) => updateLabel(index, { text: event.target.value })}
                  placeholder="Label text"
                  className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a2e8a] focus:ring-2 focus:ring-[#4a2e8a]/15"
                />
                <button
                  type="button"
                  onClick={() => removeLabel(index)}
                  className="justify-self-start rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {hasChanges && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <span className="text-xs text-emerald-800">Changes detected</span>
            <button
              type="button"
              onClick={saveProfile}
              className="rounded-md bg-[#4a2e8a] px-3 py-2 text-sm text-white transition-colors hover:bg-[#3d2574]"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

function PeerDialogPanel({
  profileKey,
  profile,
  visibleLabels,
  courses,
  sharedContext,
}: {
  profileKey: string;
  profile: PeerProfile;
  visibleLabels: PeerLabel[];
  courses: string[];
  sharedContext: string[];
}) {
  const isCurrentUser = profileKey === CURRENT_USER;

  if (isCurrentUser) {
    return <CurrentUserProfilePanel profile={profile} />;
  }

  return (
    <DialogContent
      onClick={(event) => event.stopPropagation()}
      className="max-w-[22rem] gap-0 overflow-hidden rounded-xl border-gray-200 bg-white p-0 text-gray-800 shadow-2xl sm:max-w-[24rem]"
    >
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-start gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${profile.avatarColor} text-sm text-white`} style={{ fontWeight: 700 }}>
            {profile.avatar}
          </div>
          <div className="min-w-0 flex-1 pr-6">
            <DialogTitle className="text-base leading-5 text-gray-900">{profile.name}</DialogTitle>
            <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-gray-500">
              {profile.background && <span>{profile.background}</span>}
              {profile.location && (
                <>
                  <span aria-hidden="true">-</span>
                  <span>{profile.location}</span>
                </>
              )}
            </DialogDescription>

            {visibleLabels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {visibleLabels.map((label) => (
                  <span
                    key={label.type + label.text}
                    className={pillClass(label.type)}
                    style={{ fontWeight: 500, lineHeight: 1.2 }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-5 py-4">
        <div className="mb-4">
          <p className="mb-1 text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
            About
          </p>
          <p className="text-sm text-gray-700" style={{ lineHeight: 1.6 }}>
            "{profile.bio}"
          </p>
        </div>

        <div className="mb-4 grid gap-2.5 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                Location
              </p>
              <p>{profile.location || profile.timezone || "Location not shared"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <BookOpen size={15} className="mt-0.5 shrink-0 text-gray-400" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                Courses Taken
              </p>
              <p>{courses.length > 0 ? courses.join(", ") : "No course history shared"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-[#f4f1fb] p-3.5">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[#6f5b93]" style={{ fontWeight: 800 }}>
            <Sparkles size={13} />
            Shared Context - Auto-Detected
          </div>
          <div className="space-y-1.5 text-sm text-gray-700">
            {sharedContext.length > 0 ? (
              sharedContext.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No shared context detected yet.</div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <MessageCircle size={14} />
            Message
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#4a2e8a] px-3 py-2 text-sm text-white transition-colors hover:bg-[#3d2574]"
          >
            <UserPlus size={14} />
            Connect
          </button>
        </div>

        {(profile.timezone || profile.interests || profile.background) && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
            {profile.timezone && (
              <span className="flex items-center gap-1">
                <Clock size={11} className="text-gray-400" />
                {profile.timezone}
              </span>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <span className="flex items-center gap-1">
                <Sparkles size={11} className="text-gray-400" />
                {profile.interests.join(" / ")}
              </span>
            )}
            {profile.background && (
              <span className="flex items-center gap-1">
                <Briefcase size={11} className="text-gray-400" />
                {profile.background}
              </span>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export function PeerProfileTrigger({
  name,
  children,
  buttonClassName = "",
  wrapperClassName = "",
  showPreview = false,
  stopPropagation = false,
}: PeerProfileTriggerProps) {
  const { profiles } = usePeerProfiles();
  const profile = profiles[name];
  const currentUserProfile = profiles[CURRENT_USER];
  const { visible } = usePeerVisibility();

  if (!profile) return <>{children}</>;

  const visibleLabels = getVisibleLabels(profile, currentUserProfile, visible, name === CURRENT_USER);
  const courses = profileCourses(profile);
  const sharedContext = profileSharedContext(profile, visibleLabels);

  return (
    <Dialog>
      <span className={`group relative inline-flex items-center ${wrapperClassName}`}>
        <DialogTrigger asChild>
          <button
            type="button"
            onClick={stopPropagation ? (event) => event.stopPropagation() : undefined}
            className={buttonClassName}
          >
            {children}
          </button>
        </DialogTrigger>
        {showPreview && <PeerPreviewCard profile={profile} visibleLabels={visibleLabels} />}
      </span>

      <PeerDialogPanel
        profileKey={name}
        profile={profile}
        visibleLabels={visibleLabels}
        courses={courses}
        sharedContext={sharedContext}
      />
    </Dialog>
  );
}

export function PeerName({ name, className = "", showLabelsInline = true, maxInlineLabels = 1 }: PeerNameProps) {
  const { profiles } = usePeerProfiles();
  const profile = profiles[name];
  const currentUserProfile = profiles[CURRENT_USER];
  const { visible } = usePeerVisibility();

  if (!profile) {
    return <span className={className}>{name}</span>;
  }

  const visibleLabels: PeerLabel[] = getVisibleLabels(profile, currentUserProfile, visible, name === CURRENT_USER);
  const inlineLabels = visibleLabels.slice(0, maxInlineLabels);
  const overflow = Math.max(0, visibleLabels.length - inlineLabels.length);

  return (
    <span className="inline-flex items-center gap-1.5 align-baseline">
      <PeerProfileTrigger
        name={name}
        wrapperClassName="align-baseline"
        buttonClassName={`cursor-pointer bg-transparent p-0 text-left align-baseline hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a2e8a] ${className}`}
        showPreview
        stopPropagation
      >
        {profile.name}
      </PeerProfileTrigger>
      <>
        {showLabelsInline &&
          inlineLabels.map((label) => (
            <span
              key={label.type + label.text}
              className={pillClass(label.type)}
              style={{ fontWeight: 400, lineHeight: 1.2 }}
            >
              {label.text}
            </span>
          ))}
        {showLabelsInline && overflow > 0 && (
          <span className="text-[10px] text-gray-400" style={{ lineHeight: 1.2 }}>
            +{overflow}
          </span>
        )}
      </>
    </span>
  );
}

export function PeerLabels({ name, className = "" }: { name: string; className?: string }) {
  const { profiles } = usePeerProfiles();
  const profile = profiles[name];
  const currentUserProfile = profiles[CURRENT_USER];
  const { visible } = usePeerVisibility();
  if (!profile) return null;
  const visibleLabels = getVisibleLabels(profile, currentUserProfile, visible, name === CURRENT_USER);
  if (visibleLabels.length === 0) return null;
  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`}>
      {visibleLabels.map((label) => (
        <span key={label.type + label.text} className={pillClass(label.type)} style={{ fontWeight: 400, lineHeight: 1.2 }}>
          {label.text}
        </span>
      ))}
    </span>
  );
}
