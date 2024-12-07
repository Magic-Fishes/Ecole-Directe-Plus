import React, { useEffect, useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";

// Generic Components
import CheckBox from "../../generic/UserInputs/CheckBox";
import InfoButton from "../../generic/Informative/InfoButton";
import SegmentedControl from "../../generic/UserInputs/SegmentedControl";
import DisplayThemeController from "../../generic/UserInputs/DisplayThemeController";
import NumberInput from "../../generic/UserInputs/NumberInput";
import Button from "../../generic/UserInputs/Button";
import KeyboardKey from "../../generic/KeyboardKey";
import StoreCallToAction from "../../generic/StoreCallToAction";
import { currentPeriodEvent } from "../../generic/events/setPeriodEvent";

// Context and Utilities
import { AppContext } from "../../../App";
import { applyZoom, getZoomedBoudingClientRect } from "../../../utils/zoom";
import DropDownMenu from "../../generic/UserInputs/DropDownMenu";

// Styles and Graphics
import "./Settings.css";
import RefreshIcon from "../../graphics/RefreshIcon";
import ToggleEnd from "../../graphics/ToggleEnd";

export default function Settings({ 
    usersSettings, 
    accountsList, 
    getCurrentSchoolYear, 
    resetUserData 
}) {
    // Context and Settings
    const { 
        isStandaloneApp, 
        promptInstallPWA, 
        useUserSettings, 
        globalSettings, 
        isTabletLayout 
    } = useContext(AppContext);

    // Refs
    const partyModeCheckbox = useRef(null);
    const periodEventCheckbox = useRef(null);

    // Settings and State
    const settings = useUserSettings();
    const isPeriodEventEnabled = settings.get("isPeriodEventEnabled");
    
    // New Advanced Features State
    const [isAdvancedFeaturesEnabled, setIsAdvancedFeaturesEnabled] = useState(false);

    // Side Effects
    useEffect(() => {
        document.title = "Paramètres • Ecole Directe Plus";
    }, []);

    // Confetti Animation Script Loading
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@tsparticles/confetti@3.0.3/tsparticles.confetti.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    // Handler Functions
    const handleIsPeriodEventEnabledChange = (event) => {
        settings.set("isPeriodEventEnabled", event.target.checked);
        if (event.target.checked) {
            confettiAnimation();
        }
    };

    const handleGradeScaleEnableChange = () => {
        const newEnableValue = !settings.get("isGradeScaleEnabled");
        if (newEnableValue) {
            settings.set("gradeScale", settings.get("gradeScale") ? newEnableValue * settings.get("gradeScale") : newEnableValue * 20)
        }
        settings.set("isGradeScaleEnabled", newEnableValue);
    };

    const handleGradeScaleValueChange = (newValue) => {
        if (settings.get("gradeScale") !== newValue) {
            settings.set("isGradeScaleEnabled", !!parseInt(newValue));
        }
        settings.set("gradeScale", newValue);
    };

    const handleDevChannelSwitchingToggle = () => {
        globalSettings.isDevChannel.set(!globalSettings.isDevChannel.value);
    };

    const handleSchoolYearChange = (newValue, side) => {
        newValue = parseInt(newValue);
        settings.set("isSchoolYearEnabled", true);

        let schoolYear = structuredClone(settings.get("schoolYear"));
        if (side === 0) {
            schoolYear[0] = newValue;
            schoolYear[1] = newValue + 1;
        } else {
            schoolYear[1] = newValue;
            schoolYear[0] = newValue - 1;
        }

        resetUserData(false);
        settings.set("schoolYear", schoolYear)
    };

    // Advanced Features Toggle Handler
    const handleAdvancedFeaturesToggle = () => {
        setIsAdvancedFeaturesEnabled(!isAdvancedFeaturesEnabled);
        
        // Optional: Playful sound or animation
        try {
            const toggleSound = new Audio('/toggle-sound.mp3');
            toggleSound.play();
        } catch (error) {
            console.log('Toggle sound failed', error);
        }
    };

    // Confetti Animation Function
    function confettiAnimation() {
        const bounds = getZoomedBoudingClientRect(partyModeCheckbox.current.getBoundingClientRect());
        const origin = {
            x: bounds.left + 30 / 2,
            y: bounds.top + 30 / 2
        }
        confetti({
            particleCount: 40,
            spread: 70,
            origin: {
                x: origin.x / applyZoom(window.innerWidth),
                y: origin.y / applyZoom(window.innerHeight)
            },
        });
    }

    return (
        <div id="settings">
            <div id="settings-box">
                <h1>Paramètres</h1>

                {/* Advanced Features Master Switch */}
                <div className="setting" id="advanced-features-master-switch">
                    <CheckBox 
                        id="advanced-features-cb" 
                        label={
                            <span>
                                Activer les fonctionnalités avancées 
                                <span 
                                    style={{ 
                                        marginLeft: '10px', 
                                        color: isAdvancedFeaturesEnabled ? 'green' : 'red',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isAdvancedFeaturesEnabled ? 'ON' : 'OFF'}
                                </span>
                            </span>
                        } 
                        checked={isAdvancedFeaturesEnabled} 
                        onChange={handleAdvancedFeaturesToggle}
                    />
                    <InfoButton className="setting-tooltip">
                        Active ou désactive l'ensemble des fonctionnalités avancées et expérimentales. 
                        Soyez prudent, ces fonctionnalités peuvent affecter les performances ou la stabilité.
                    </InfoButton>
                </div>

                {/* Existing Basic Settings */}
                <div className="setting" id="keep-logged-in">
                    <CheckBox 
                        id="keep-logged-in-cb" 
                        checked={globalSettings.keepLoggedIn.value} 
                        onChange={(event) => globalSettings.keepLoggedIn.set(event.target.checked)} 
                        label={<span>Rester connecté</span>} 
                    />
                    <InfoButton className="setting-tooltip">
                        Avertissement : cette fonctionnalité peut présenter des risques, 
                        notamment si vous êtes infecté par un logiciel malveillant 
                        (peut nécessiter une reconnexion)
                    </InfoButton>
                </div>

                {/* Display Theme Setting */}
                <div className="setting" id="display-theme">
                    <span>Thème d'affichage</span> 
                    <DisplayThemeController 
                        id="display-theme-sc" 
                        selected={settings.get("displayTheme")} 
                        onChange={(value) => { settings.set("displayTheme", value) }} 
                        fieldsetName="display-theme" 
                    />
                </div>

                {/* More existing settings... */}
                
                {/* Advanced Features Section (Conditionally Rendered) */}
                {isAdvancedFeaturesEnabled && (
                    <div id="advanced-features-section">
                        {/* Experimental Features */}
                        <div className="setting" id="experimental-features">
                            <h3>Fonctionnalités expérimentales</h3>
                            
                            <div className="experimental-feature">
                                <CheckBox 
                                    id="neural-prediction-cb" 
                                    label={<span>Prédictions d'analyse de notes (Bêta)</span>} 
                                    checked={settings.get("neuralPrediction") || false} 
                                    onChange={(event) => { 
                                        settings.set("neuralPrediction", event.target.checked);
                                    }} 
                                />
                                <InfoButton className="setting-tooltip">
                                    Utilise l'intelligence artificielle pour prédire vos futures 
                                    performances académiques basées sur vos notes historiques. 
                                    Fonctionnalité expérimentale.
                                </InfoButton>
                            </div>
                            
                            <div className="experimental-feature">
                                <CheckBox 
                                    id="performance-tracking-cb" 
                                    label={<span>Tableau de bord de performance détaillé</span>} 
                                    checked={settings.get("detailedPerformanceTracking") || false} 
                                    onChange={(event) => { 
                                        settings.set("detailedPerformanceTracking", event.target.checked);
                                    }} 
                                />
                                <InfoButton className="setting-tooltip">
                                    Génère des graphiques et des statistiques avancées sur vos 
                                    performances scolaires, avec des comparaisons historiques et des tendances.
                                </InfoButton>
                            </div>
                        </div>

                        {/* Performance Optimization */}
                        <div className="setting" id="performance-optimization">
                            <h3>Optimisation des performances</h3>
                            
                            <div className="performance-option">
                                <CheckBox 
                                    id="aggressive-caching-cb" 
                                    label={<span>Mise en cache agressive</span>} 
                                    checked={settings.get("aggressiveCaching") || false} 
                                    onChange={(event) => { 
                                        settings.set("aggressiveCaching", event.target.checked);
                                    }} 
                                />
                                <InfoButton className="setting-tooltip">
                                    Améliore les temps de chargement en conservant plus de données 
                                    en mémoire. Peut augmenter la consommation de mémoire.
                                </InfoButton>
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing Settings Sections (Advanced Settings, Keyboard Shortcuts, etc.) */}
                <div id="advanced-settings">
                    <h2 className="heading">Paramètres avancés</h2>
                    {/* Existing advanced settings content */}
                    
                    {/* Dev Channel Settings */}
                    <div className={`setting${isStandaloneApp ? " disabled" : ""}`} id="dev-channel">
                        <div className="setting-label">
                            <span>Basculer sur le canal {globalSettings.isDevChannel.value ? "stable" : "développeur"}</span>
                            <InfoButton className="setting-tooltip">
                                Profitez des dernières fonctionnalités en avant-première. 
                                Avertissement : ce canal peut être instable et susceptible de dysfonctionner.
                            </InfoButton>
                        </div>
                        <Button 
                            onClick={handleDevChannelSwitchingToggle} 
                            className="toggle-button"
                        >
                            Basculer<ToggleEnd />
                        </Button>
                    </div>
                </div>

                {/* Footer Links */}
                <div id="diverse-links">
                    <Link to="#patch-notes">Patch Notes</Link> • 
                    <Link to="#policy">Mentions légales</Link> • 
                    <Link to="/feedback">Faire un retour</Link> • 
                    <a href="https://github.com/Magic-Fishes/Ecole-Directe-Plus" target="_blank">Github</a> • 
                    <a href="https://discord.gg/AKAqXfTgvE" target="_blank">Discord</a>
                </div>
            </div>
        </div>
    );
}
