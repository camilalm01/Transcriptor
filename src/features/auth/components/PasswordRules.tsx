import { Check, X } from "lucide-react";

import type {
    PasswordValidation,
} from "../types/auth.types";

interface PasswordRulesProps {
    rules: PasswordValidation;
}

interface RuleItemProps {
    valid: boolean;
    text: string;
}

function RuleItem({
    valid,
    text,
}: RuleItemProps) {
    return (
        <div
            className="
        flex
        items-center
        gap-3
      "
        >
            {valid ? (
                <div
                    className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-green-100
          "
                >
                    <Check
                        size={14}
                        className="text-green-600"
                    />
                </div>
            ) : (
                <div
                    className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-red-100
          "
                >
                    <X
                        size={14}
                        className="text-red-500"
                    />
                </div>
            )}

            <span
                className={`
          text-sm
          ${valid
                        ? "text-green-700"
                        : "text-slate-600"
                    }
        `}
            >
                {text}
            </span>
        </div>
    );
}

export default function PasswordRules({
    rules,
}: PasswordRulesProps) {
    const allValid =
        rules.minLength &&
        rules.uppercase &&
        rules.lowercase &&
        rules.number;

    return (
        <section
            className={`
        rounded-2xl
        border
        p-4
        transition-all

        ${allValid
                    ? "border-green-300 bg-green-50"
                    : "border-slate-200 bg-slate-50"
                }
      `}
        >
            <div
                className="
          mb-3
          flex
          items-center
          justify-between
        "
            >
                <h3
                    className="
            font-semibold
            text-slate-800
          "
                >
                    Requisitos de la contraseña
                </h3>

                {allValid && (
                    <span
                        className="
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              font-medium
              text-green-700
            "
                    >
                        Completado
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <RuleItem
                    valid={rules.minLength}
                    text="Mínimo 8 caracteres"
                />

                <RuleItem
                    valid={rules.uppercase}
                    text="Una letra mayúscula"
                />

                <RuleItem
                    valid={rules.lowercase}
                    text="Una letra minúscula"
                />

                <RuleItem
                    valid={rules.number}
                    text="Al menos un número"
                />
            </div>

        </section>
    );
}