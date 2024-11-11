
import { useState, useRef, createContext, useContext, forwardRef, isValidElement, cloneElement } from "react";
import {
    useFloating,
    useHover,
    useFocus,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    useTransitionStyles,
    autoUpdate,
    arrow,
    FloatingArrow,
    offset,
    flip,
    shift,
    safePolygon,
    useMergeRefs,
    FloatingPortal
} from "@floating-ui/react";
import { AppContext } from "../../../App";
// Check out the FloatingUI docs for more information : https://floating-ui.com/docs/react

import './Tooltip.css'

const ARROW_WIDTH = 16;
const ARROW_HEIGHT = 8;

function useTooltip(options) {
    // available options:
    // isOpen (bool) ; placement (str: "top" ; "right" ; ...) ; animationDuration (int: ms) ; delay (int: ms) ;
    // restDuration (int: ms) ; restFallbackDuration (int: ms) ; disableSafePolygon (bool)
    // enableHover (bool) ; enableFocus (bool) ; enableClick (bool) ; enableDismiss (bool)

    const [isOpen, setIsOpen] = useState(options.isOpen ?? false);

    const arrowRef = useRef(null);

    // - - Floating properties - -
    const data = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        // AutoUpdate position :
        // whileElementsMounted(...args) {
        //     const cleanup = autoUpdate(...args, { animationFrame: true });
        //     // Important! Always return the cleanup function.
        //     return cleanup;
        // },
        whileElementsMounted: autoUpdate,
        placement: (options.placement ?? "top"),
        middleware: [offset(ARROW_HEIGHT + 2), flip(), shift({ padding: 10 }), arrow({ element: arrowRef })],
    });

    const context = data.context;
    const middlewareData = data.middlewareData;

    const arrowX = middlewareData.arrow?.x ?? 0;
    const arrowY = middlewareData.arrow?.y ?? 0;
    const transformX = arrowX + ARROW_WIDTH / 2;
    const transformY = arrowY + ARROW_HEIGHT;

    // - - Interactions - -
    const hover = useHover(context, {
        enabled: (options.enableHover ?? true),
        restMs: (options.restDuration ?? 0),
        delay: (options.restDuration ? { open: options.restFallbackDuration } : { open: (options.delay ?? 0) }),
        handleClose: ((options.disableSafePolygon === undefined || options.disableSafePolygon) ? safePolygon() : null)
    });

    const focus = useFocus(context, {
        enabled: (options.enableFocus ?? true)
    });

    const click = useClick(context, {
        enabled: (options.enableClick ?? false)
    });

    const dismiss = useDismiss(context, {
        enabled: (options.enableDismiss ?? true),
        outsidePressEvent: 'click'
    });

    const role = useRole(context, {
        role: "tooltip"
    });

    const interactions = useInteractions([
        hover,
        focus,
        click,
        dismiss,
        role
    ]);

    // - - Transitions - -
    const transition = useTransitionStyles(context, {
        duration: (options.animationDuraction ?? 250),

        initial: ({ side }) => ({
            opacity: 0,
            // transform: "scale(0)",
            // scale: 0
            translate: side === 'top'
                ? "0px 8px"
                : "0px -8px",
            // scale: "0",
        }),

        common: ({ side }) => ({
            transformOrigin: {
                top: `${transformX}px calc(100% + ${ARROW_HEIGHT}px)`,
                bottom: `${transformX}px ${-ARROW_HEIGHT}px`,
                left: `calc(100% + ${ARROW_HEIGHT}px) ${transformY}px`,
                right: `${-ARROW_HEIGHT}px ${transformY}px`
            }[side]
        }),

        // open: {
        //     // opacity: 1,
        //     // transform: "scale(1)",
        //     // translate: "none",
        // },
    });

    return ({
        isOpen,
        setIsOpen,
        arrowRef,
        options,
        ...interactions,
        ...transition,
        ...data
    })
}

const TooltipContext = createContext(null);

function useTooltipContext() {
    // Fonction pour sécuriser la récupération du context
    const context = useContext(TooltipContext);

    if (context === null) {
        throw new Error("TooltipTrigger or TooltipContent components must be wrapped in <Tooltip />");
    }

    return context;
};

export function Tooltip({ children, className = "", id = "", ...options }) {
    const tooltip = useTooltip(options);

    return (
        <div className={`tooltip ${className}`} id={id}>
            <TooltipContext.Provider value={tooltip}>
                {children}
            </TooltipContext.Provider>
        </div>
    );
}

export const TooltipTrigger = forwardRef(function TooltipTrigger({ children, ...props }, propRef) {
    const context = useTooltipContext();

    const ref = useMergeRefs([context.refs.setReference, children.ref, propRef]);

    // Si children est un composant, on lui rajoute les props 
    if (isValidElement(children)) {
        return cloneElement(
            children,
            context.getReferenceProps({
                ref,
                ...props,
                ...children.props,
                tabIndex: 0,
                // on peut styliser le composant en fonction de l'état
                "data-state": context.isOpen ? "open" : "closed"
            })
        );
    }

    // Si children n'est pas un composant (ex : texte), on le met dans une div et applique les props
    return (
        <div
            ref={ref}
            // on peut styliser le composant en fonction de l'état
            data-state={context.isOpen ? "open" : "closed"}
            {...context.getReferenceProps(props)}
            tabIndex="0"
        >
            {children}
        </div>
    );
});

export const TooltipContent = forwardRef(function TooltipContent({ children, style, className = "", ...props }, propRef) {
    const context = useTooltipContext();
    const ref = useMergeRefs([context.refs.setFloating, children.ref, propRef]);

    // Affiche / N'affiche pas la tooltip
    if (!context.isMounted) return null;

    // Gestion du clic à l'intérieur pour fermer la tooltip
    const handleClickInside = () => {
        if (context.options.closeOnClickInside) {
            context.setIsOpen(false);
        }
    };

    return (
        <FloatingPortal>
            <div
                ref={ref}
                className={`tooltip-content ${className}`}
                style={{
                    ...context.floatingStyles,
                    ...context.styles,
                    ...style
                }}
                {...context.getFloatingProps(props)}
                onClick={handleClickInside}
            >
                <FloatingArrow className={`floating-arrow ${className}`} ref={context.arrowRef} context={context} tipRadius={2} width={ARROW_WIDTH} height={ARROW_HEIGHT} />
                {children}
            </div>
        </FloatingPortal>
    );
});

