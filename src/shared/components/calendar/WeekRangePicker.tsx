import { useState } from "react";

import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import Modal from "../ui/modals/Modal";

import WeekRangeCalendar, {
  type DateRange,
} from "./WeekRangeCalendar";

import Button from "../ui/buttons/Button";

interface WeekRangePickerProps {
  value?: DateRange;

  onChange: (
    range: DateRange
  ) => void;
}

export default function WeekRangePicker({
  value,
  onChange,
}: WeekRangePickerProps) {

  const [open, setOpen] =
    useState(false);

  const [tempRange, setTempRange] =
  useState<DateRange>(
    value ?? {
      startDate: null,
      endDate: null,
    }
  );

  const formatDate = (
    date: Date | null
  ) => {

    if (!date) {
      return "";
    }

    return date.toLocaleDateString(
      "es-EC",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getLabel = () => {

    if (
      !value?.startDate ||
      !value?.endDate
    ) {
      return "Seleccionar rango";
    }

    return `${formatDate(
      value.startDate
    )} - ${formatDate(
      value.endDate
    )}`;
  };

  const handleOpen = () => {

    setTempRange(
      value ?? {
        startDate: null,
        endDate: null,
      }
    );

    setOpen(true);
  };

  const handleCancel = () => {

    setTempRange(
      value ?? {
        startDate: null,
        endDate: null,
      }
    );

    setOpen(false);
  };

  const handleApply = () => {

    if (
      !tempRange.startDate ||
      !tempRange.endDate
    ) {
      return;
    }

    onChange(tempRange);

    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="
          w-full

          rounded-3xl

          border
          border-(--border)

          bg-(--surface)

          px-6
          py-5

          shadow-sm

          hover:shadow-md

          flex
          items-center
          justify-between
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <CalendarDays
            size={30}
            className="
              text-(--primary)
            "
          />

          <div className="text-left">
            <p
              className="
                text-lg
                font-semibold
              "
            >
              {getLabel()}
            </p>

            <p
              className="
                text-sm
                text-(--text-secondary)
              "
            >
              Rango de fechas seleccionado
            </p>
          </div>
        </div>

        <ChevronDown
          className="
            text-(--text-secondary)
          "
        />
      </button>

      <Modal
        isOpen={open}
        title="Seleccionar rango"
        onClose={handleCancel}
      >
        <WeekRangeCalendar
          value={tempRange}
          onChange={setTempRange}
        />

        <div
          className="
            mt-5
            space-y-2
          "
        >
          <p className="text-sm text-(--text-secondary)">
            <strong>Desde:</strong>{" "}
            {tempRange.startDate
              ? tempRange.startDate.toLocaleDateString(
                  "es-EC"
                )
              : "--"}
          </p>

          <p className="text-sm text-(--text-secondary)">
            <strong>Hasta:</strong>{" "}
            {tempRange.endDate
              ? tempRange.endDate.toLocaleDateString(
                  "es-EC"
                )
              : "--"}
          </p>
        </div>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Cancelar
          </Button>

          <Button
            disabled={
              !tempRange.startDate ||
              !tempRange.endDate
            }
            onClick={handleApply}
          >
            Aplicar
          </Button>
        </div>
      </Modal>
    </>
  );
}