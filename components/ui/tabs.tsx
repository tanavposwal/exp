"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Root ref={ref} {...props}>
      <div className={cn("relative", className)}>{props.children}</div>
    </TabsPrimitive.Root>
  );
});

Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [backgroundStyle, setBackgroundStyle] = React.useState({});
  const tabsListRef = React.useRef<HTMLDivElement>(null);
  const backgroundRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!tabsListRef.current || !backgroundRef.current) return;

    const tabsList = tabsListRef.current;
    const updateBackground = () => {
      const activeTabElement = tabsList.querySelector(`[data-state="active"]`);
      if (!activeTabElement) return;

      const tabsListRect = tabsList.getBoundingClientRect();
      const activeTabRect = activeTabElement.getBoundingClientRect();

      const left = activeTabRect.left - tabsListRect.left;
      const width = activeTabRect.width;

      setBackgroundStyle({
        transform: `translateX(${left}px)`,
        width: `${width}px`,
      });
    };

    // Initial position
    updateBackground();

    // Watch for changes to data-state attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-state") {
          updateBackground();
        }
      });
    });

    // Observe all tab triggers for data-state changes
    const tabTriggers = tabsList.querySelectorAll("[data-state]");
    tabTriggers.forEach((trigger) => {
      observer.observe(trigger, { attributes: true });
    });

    return () => observer.disconnect();
  }, [children]);

  return (
    <TabsPrimitive.List
      ref={tabsListRef}
      className={cn(
        "inline-flex h-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground relative",
        className
      )}
      {...props}>
      <TabsBackground
        ref={backgroundRef}
        style={backgroundStyle}
        className="h-[calc(100%-8px)]"
      />
      {children}
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-4 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10 data-[state=active]:text-foreground data-[state=active]:font-semibold",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsBackground = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bg-background rounded-md shadow-sm transition-all duration-200 ease-in-out",
      className
    )}
    {...props}
  />
));
TabsBackground.displayName = "TabsBackground";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsBackground };
