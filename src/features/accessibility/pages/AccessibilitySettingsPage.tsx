import MainLayout from "../../../app/layouts/MainLayout";

import Header from "../../../shared/components/ui/navigation/Header";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";
import ThemeSelector from
    "../../../shared/components/ui/selection/ThemeSelector";

export default function AccessibilitySettingsPage() {

    const {
        settings,
        setScale,
        setTheme,
    } = useAccessibility();

    return (
        <MainLayout>

            <Header
                title="Accesibilidad"
                showBackButton
            />

            <div className="space-y-8 p-5">

                <div>

                    <h2 className="text-2xl font-bold">
                        Ajuste de contenido
                    </h2>

                    <p className="mt-4">
                        Escalado: {settings.scale}%
                    </p>

                    <input
                        type="range"
                        min="80"
                        max="200"
                        step="5"
                        value={settings.scale}
                        onChange={(e) =>
                            setScale(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                        className="
              mt-5
              w-full
            "
                    />
                </div>

                <div>

                    <h2 className="text-2xl font-bold">
                        Ajuste de colores
                    </h2>

                    <div className="mt-5 space-y-4">

                            <ThemeSelector
                                value={settings.theme}
                                onChange={setTheme}
                            />

                            <ThemeSelector
                                value={settings.theme}
                                onChange={setTheme}
                            />
                        

                            <ThemeSelector
                                value={settings.theme}
                                onChange={setTheme}
                            />

                    </div>
                </div>

            </div>

        </MainLayout>
    );
}