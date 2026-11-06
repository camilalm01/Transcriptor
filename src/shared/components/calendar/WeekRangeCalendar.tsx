import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { useState } from "react";

export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface Props {
    value?: DateRange;

    onChange: (
        range: DateRange
    ) => void;
}

const weekdays = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom",
];

export default function WeekRangeCalendar({
    value,
    onChange,
}: Props) {

    const today = new Date();

    const [
        currentMonth,
        setCurrentMonth,
    ] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );

    const year = currentMonth.getFullYear();

    const month = currentMonth.getMonth();

    const monthName = currentMonth.toLocaleDateString(
            "es-EC",
            {
                month: "long",
            }
        );

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const offset =
        firstDay === 0
            ? 6
            : firstDay - 1;

    const handleSelectDate = (
        day: number
    ) => {

        const selectedDate = new Date( year, month, day );
        if (
            !value?.startDate ||
            (
                value.startDate &&
                value.endDate
            )
        ) {
            onChange({
                startDate:selectedDate,
                endDate: null,
            });

            return;
        }

        if (
            selectedDate <
            value.startDate
        ) {

            onChange({
                startDate: selectedDate,
                endDate: value.startDate,
            });
            return;
        }

        onChange({
            startDate: value.startDate,
            endDate: selectedDate,
        });
    };
    const isStartDate = ( day: number ) => {
        if (
            !value?.startDate
        ) {
            return false;
        }

        const date = new Date( year, month, day);
        return (
            date.toDateString() ===
            value.startDate.toDateString()
        );
    };

    const isEndDate = (day: number) => {
        if (
            !value?.endDate
        ) {
            return false;
        }

        const date = new Date( year, month, day);
        return (
            date.toDateString() ===
            value.endDate.toDateString()
        );
    };

    const isInRange = (day: number) => {

        if (
            !value?.startDate ||
            !value?.endDate
        ) {
            return false;
        }

        const date = new Date(year, month, day);
        return (
            date >
            value.startDate &&
            date <
            value.endDate
        );
    };

    return (
        <div className=" rounded-2xl bg-(--bg)">
            <div
                className="mb-6 flex items-center justify-between gap-3">
                <button
                    type="button"
                    aria-label="Mes anterior"
                    onClick={() =>
                        setCurrentMonth(
                            new Date(
                                year,
                                month - 1,
                                1
                            )
                        )
                    }
                    className="flex items-center rounded-lg px-2 py-1 
                    text-(--primary) hover:bg-(--surface) border border-(--border) transition-colors"
                >
                    <ChevronLeft />
                    <span className="text-sm font-medium">
                        Anterior
                    </span>
                </button>

                <h3
                    className="flex-1 text-center text-xl font-semibold capitalize">
                    {monthName}
                </h3>

                <button
                    type="button"
                    aria-label="Mes siguiente"
                    onClick={() =>
                        setCurrentMonth(
                            new Date(
                                year,
                                month + 1,
                                1
                            )
                        )
                    }
                    className="flex items-center rounded-lg px-2 py-1
                    text-(--primary) hover:bg-(--surface) border border-(--border)"
                >
                    <span className="text-sm font-medium">
                        Siguiente
                    </span>
                    <ChevronRight />
                </button>
            </div>

            <div
                className="
          mb-3
          grid
          grid-cols-7
          text-center
          text-sm
          font-medium
          text-(--text-secondary)">
                {weekdays.map(
                    (weekday) => (
                        <div
                            key={weekday}
                        >
                            {weekday}
                        </div>
                    )
                )}
            </div>

            <div
                className="grid grid-cols-7 gap-1">
                {Array.from({
                    length: offset,
                }).map((_, index) => (
                    <div
                        key={index}
                    />
                ))}

                {Array.from({
                    length: daysInMonth,
                }).map((_, index) => {

                    const day =
                        index + 1;

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() =>
                                handleSelectDate(
                                    day
                                )
                            }
                            className={`
                h-11
                w-11

                rounded-xl

                flex
                items-center
                justify-center

                transition-colors

                ${isInRange(day)
                                    ? "bg-[#EEF3FF] text-[#5B7CF0]"
                                    : ""
                                }

                ${isStartDate(day) ||
                                    isEndDate(day)
                                    ? "bg-[#5B7CF0] text-white"
                                    : ""
                                }

                ${!isInRange(day) &&
                                    !isStartDate(day) &&
                                    !isEndDate(day)
                                    ? "hover:bg-slate-100"
                                    : ""
                                }
              `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}