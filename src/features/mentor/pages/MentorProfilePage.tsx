import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    DollarSign,
    Star,
    Users,
    Edit2,
    Check,
    X,
} from "lucide-react";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    Skeleton,
    SkeletonLine,
    Input,
} from "@/components/ui";
import { useMentorProfile, useUpdateMentor } from "../hooks/useMentors";
import { SlotPicker } from "../components/SlotPicker";
import { useAuthStore } from "@/stores/auth.store";
import { useI18n } from "@/i18n/i18n";
import { Role } from "@/lib/constants";

export default function MentorProfilePage() {
    const { t } = useI18n();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuthStore();

    const mentorId = Number(id) || user?.profileId || 0;

    const isMentorOwner =
        user?.role === Role.MENTOR && (!id || mentorId === user?.profileId);
    const canBook = user?.role === Role.STUDENT;

    const { data: mentor, isLoading, error } = useMentorProfile(mentorId);
    const updateMentorMutation = useUpdateMentor(mentorId);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        bio: "",
        hourlyRate: 0,
        available: false,
    });

    const handleEdit = () => {
        if (mentor) {
            setFormData({
                title: mentor.title,
                bio: mentor.bio,
                hourlyRate: mentor.hourlyRate,
                available: mentor.available ?? false,
            });
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        updateMentorMutation.mutate(formData, {
            onSuccess: () => setIsEditing(false),
        });
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-gutter py-8">
                <Skeleton className="mb-6 h-8 w-40" />
                <Card className="space-y-4">
                    <Skeleton className="h-10 w-2/3" />
                    <SkeletonLine />
                    <SkeletonLine className="w-5/6" />
                    <Skeleton className="h-24 w-full" />
                </Card>
            </div>
        );
    }

    if (error || !mentor) {
        return (
            <div className="mx-auto max-w-4xl px-gutter py-8">
                {!id ? null : (
                    <Link
                        to="/"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-ember"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("mentor.backToDiscovery")}
                    </Link>
                )}
                <EmptyState
                    icon={<Users className="h-10 w-10" />}
                    title={t("mentor.notFound")}
                    description={t("mentor.notFoundDesc")}
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-gutter py-8">
            {!id ? null : (
                <Link
                    to="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-ember"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {t("mentor.backToDiscovery")}
                </Link>
            )}

            <Card accentBar>
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h1 className="font-display text-headline-md italic text-text-primary">
                                {mentor.name}
                            </h1>
                            {!isEditing && isMentorOwner && (
                                <Button
                                    variant="secondary"
                                    onClick={handleEdit}
                                    className="ml-4 shrink-0"
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    {t("mentor.editProfile")}
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-4 space-y-4 max-w-md">
                                <Input
                                    label={t("mentor.titleLabel")}
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ) : (
                            <p className="mt-2 text-lg text-text-secondary">
                                {mentor.title}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {mentor.stacks.map((stack) => (
                                <Badge key={stack.id} variant="ember">
                                    {stack.name}
                                </Badge>
                            ))}
                            {isEditing ? (
                                <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer mt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.available}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                available: e.target.checked,
                                            })
                                        }
                                        className="accent-ember h-4 w-4"
                                    />
                                    {t("mentor.availableNow")}
                                </label>
                            ) : (
                                mentor.available && (
                                    <Badge variant="success">
                                        {t("mentor.availableNow")}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-container-high p-4 min-w-50">
                        <div className="flex items-center gap-2 text-ember">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="text-2xl font-semibold">
                                {mentor.rating.toFixed(1)}
                            </span>
                            <span className="text-sm text-text-secondary">
                                {t("mentor.rating")}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-text-primary">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-ember" />
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        className="w-24 text-lg p-2"
                                        value={formData.hourlyRate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                hourlyRate: Number(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                    />
                                ) : (
                                    <span className="text-2xl font-semibold">
                                        {t("mentor.hourlyRateOnly").replace("{rate}", String(mentor.hourlyRate))}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-text-secondary whitespace-nowrap">
                                {t("mentor.perHour")}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                            <Users className="h-4 w-4" />
                            {t("mentor.completedSessions").replace("{count}", String(mentor.totalSessions))}
                        </div>
                    </div>
                </div>
            </Card>

            <section className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-text-primary">
                    {t("mentor.about")}
                </h2>
                <Card>
                    {isEditing ? (
                        <div className="space-y-4">
                            <textarea
                                className="w-full rounded bg-surface px-4 py-3 font-body text-body-md text-text-primary border-b-2 border-text-secondary/30 outline-none transition-all duration-200 placeholder:text-text-secondary/50 focus:border-ember focus:-translate-y-px min-h-37.5 resize-y"
                                value={formData.bio}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bio: e.target.value,
                                    })
                                }
                                placeholder={t("mentor.writeBioPlaceholder")}
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                    disabled={updateMentorMutation.isPending}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMentorMutation.isPending}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    {updateMentorMutation.isPending
                                        ? t("mentor.saving")
                                        : t("mentor.saveChanges")}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-body-md leading-relaxed text-text-secondary">
                            {mentor.bio}
                        </p>
                    )}
                </Card>
            </section>

            <section className="mt-8">
                <h2 className="mb-3 text-lg font-semibold text-text-primary">
                    {t("booking.sectionTitle")}
                </h2>
                <Card>
                    <SlotPicker
                        mentorId={mentorId}
                        mentorName={mentor.name}
                        canBook={canBook}
                    />
                </Card>
            </section>
        </div>
    );
}
