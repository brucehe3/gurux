'use client';

import { SectionHeader } from '@/components/home/section-header';
import type { PricingTier } from '@/lib/home';
import { siteConfig } from '@/lib/home';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  getSubscription,
  createCheckoutSession,
  SubscriptionStatus,
  CreateCheckoutSessionResponse,
} from '@/lib/api';
import { toast } from 'sonner';
import { isLocalMode } from '@/lib/config';
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/motion";

// Constants
const DEFAULT_SELECTED_PLAN = '6 hours';
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'base',
  ENTERPRISE: 'extra',
};

// Types
type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'ghost'
  | 'outline'
  | 'link'
  | null;

interface PricingTabsProps {
  activeTab: 'cloud' | 'self-hosted';
  setActiveTab: (tab: 'cloud' | 'self-hosted') => void;
  className?: string;
}

interface PriceDisplayProps {
  price: string;
  isCompact?: boolean;
}

interface CustomPriceDisplayProps {
  price: string;
}

interface UpgradePlan {
  hours: string;
  price: string;
  stripePriceId: string;
}

interface PricingTierProps {
  tier: PricingTier;
  isCompact?: boolean;
  currentSubscription: SubscriptionStatus | null;
  isLoading: Record<string, boolean>;
  isFetchingPlan: boolean;
  selectedPlan?: string;
  onPlanSelect?: (planId: string) => void;
  onSubscriptionUpdate?: () => void;
  isAuthenticated?: boolean;
  returnUrl: string;
}

// Components
function PricingTabs({ activeTab, setActiveTab, className }: PricingTabsProps) {
  return (
    <div
      className={cn(
        'relative flex w-fit items-center rounded-full border p-0.5 backdrop-blur-sm cursor-pointer h-9 flex-row bg-muted',
        className,
      )}
    >
      {['cloud', 'self-hosted'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as 'cloud' | 'self-hosted')}
          className={cn(
            'relative z-[1] px-3 h-8 flex items-center justify-center cursor-pointer',
            {
              'z-0': activeTab === tab,
            },
          )}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 rounded-full bg-white dark:bg-[#3F3F46] shadow-md border border-border"
              transition={{
                duration: 0.2,
                type: 'spring',
                stiffness: 300,
                damping: 25,
                velocity: 2,
              }}
            />
          )}
          <span
            className={cn(
              'relative block text-sm font-medium duration-200 shrink-0',
              activeTab === tab ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {tab === 'cloud' ? 'Cloud' : 'Self-hosted'}
          </span>
        </button>
      ))}
    </div>
  );
}

function PriceDisplay({ price, isCompact }: PriceDisplayProps) {
  return (
    
    <div className="flex items-baseline mt-2">
      <span className="text-4xl font-bold">{price}</span>
      {price !="$0" && (
          <span className="ml-1 text-muted-foreground">/month</span>
      )}
    </div>
  );
}

function CustomPriceDisplay({ price }: CustomPriceDisplayProps) {
  return (
    <div className="flex items-baseline mt-2">
      <span className="text-4xl font-bold">{price}</span>
        <span className="ml-1 text-muted-foreground">/month</span>
    </div>
  );
}

function PricingTier({
  tier,
  isCompact = false,
  currentSubscription,
  isLoading,
  isFetchingPlan,
  selectedPlan,
  onPlanSelect,
  onSubscriptionUpdate,
  isAuthenticated = false,
  returnUrl,
}: PricingTierProps) {
  const [localSelectedPlan, setLocalSelectedPlan] = useState(
    selectedPlan || DEFAULT_SELECTED_PLAN,
  );
  const hasInitialized = useRef(false);

  // Auto-select the correct plan only on initial load
  useEffect(() => {
    if (
      !hasInitialized.current &&
      tier.name === 'Custom' &&
      tier.upgradePlans &&
      currentSubscription?.price_id
    ) {
      const matchingPlan = tier.upgradePlans.find(
        (plan) => plan.stripePriceId === currentSubscription.price_id,
      );
      if (matchingPlan) {
        setLocalSelectedPlan(matchingPlan.hours);
      }
      hasInitialized.current = true;
    }
  }, [currentSubscription, tier.name, tier.upgradePlans]);

  // Only refetch when plan is selected
  const handlePlanSelect = (value: string) => {
    setLocalSelectedPlan(value);
    if (tier.name === 'Custom' && onSubscriptionUpdate) {
      onSubscriptionUpdate();
    }
  };

  const handleSubscribe = async (planStripePriceId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }

    if (isLoading[planStripePriceId]) {
      return;
    }

    try {
      // For custom tier, get the selected plan's stripePriceId
      let finalPriceId = planStripePriceId;
      if (tier.name === 'Custom' && tier.upgradePlans) {
        const selectedPlan = tier.upgradePlans.find(
          (plan) => plan.hours === localSelectedPlan,
        );
        if (selectedPlan?.stripePriceId) {
          finalPriceId = selectedPlan.stripePriceId;
        }
      }

      onPlanSelect?.(finalPriceId);

      const response: CreateCheckoutSessionResponse =
        await createCheckoutSession({
          price_id: finalPriceId,
          success_url: returnUrl,
          cancel_url: returnUrl,
        });

      console.log('Subscription action response:', response);

      switch (response.status) {
        case 'new':
        case 'checkout_created':
          if (response.url) {
            window.location.href = response.url;
          } else {
            console.error(
              "Error: Received status 'checkout_created' but no checkout URL.",
            );
            toast.error('Failed to initiate subscription. Please try again.');
          }
          break;
        case 'upgraded':
        case 'updated':
          const upgradeMessage = response.details?.is_upgrade
            ? `Subscription upgraded from $${response.details.current_price} to $${response.details.new_price}`
            : 'Subscription updated successfully';
          toast.success(upgradeMessage);
          if (onSubscriptionUpdate) onSubscriptionUpdate();
          break;
        case 'downgrade_scheduled':
        case 'scheduled':
          const effectiveDate = response.effective_date
            ? new Date(response.effective_date).toLocaleDateString()
            : 'the end of your billing period';

          const statusChangeMessage = 'Subscription change scheduled';

          toast.success(
            <div>
              <p>{statusChangeMessage}</p>
              <p className="text-sm mt-1">
                Your plan will change on {effectiveDate}.
              </p>
            </div>,
          );
          if (onSubscriptionUpdate) onSubscriptionUpdate();
          break;
        case 'no_change':
          toast.info(response.message || 'You are already on this plan.');
          break;
        default:
          console.warn(
            'Received unexpected status from createCheckoutSession:',
            response.status,
          );
          toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error: any) {
      console.error('Error processing subscription:', error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to process subscription. Please try again.';
      toast.error(errorMessage);
    }
  };

  const getPriceValue = (
    tier: (typeof siteConfig.cloudPricingItems)[0],
    selectedHours?: string,
  ): string => {
    if (tier.upgradePlans && selectedHours) {
      const plan = tier.upgradePlans.find(
        (plan) => plan.hours === selectedHours,
      );
      if (plan) {
        return plan.price;
      }
    }
    return tier.price;
  };

  const getDisplayedHours = (
    tier: (typeof siteConfig.cloudPricingItems)[0],
  ) => {
    if (tier.name === 'Custom' && localSelectedPlan) {
      return localSelectedPlan;
    }
    return tier.hours;
  };

  const getSelectedPlanPriceId = (
    tier: (typeof siteConfig.cloudPricingItems)[0],
  ): string => {
    if (tier.name === 'Custom' && tier.upgradePlans) {
      const selectedPlan = tier.upgradePlans.find(
        (plan) => plan.hours === localSelectedPlan,
      );
      return selectedPlan?.stripePriceId || tier.stripePriceId;
    }
    return tier.stripePriceId;
  };

  const getSelectedPlanPrice = (
    tier: (typeof siteConfig.cloudPricingItems)[0],
  ): string => {
    if (tier.name === 'Custom' && tier.upgradePlans) {
      const selectedPlan = tier.upgradePlans.find(
        (plan) => plan.hours === localSelectedPlan,
      );
      return selectedPlan?.price || tier.price;
    }
    return tier.price;
  };

  const tierPriceId = getSelectedPlanPriceId(tier);
  const isCurrentActivePlan =
    isAuthenticated &&
    // For custom tier, check if the selected plan matches the current subscription
    (tier.name === 'Custom'
      ? tier.upgradePlans?.some(
          (plan) =>
            plan.hours === localSelectedPlan &&
            plan.stripePriceId === currentSubscription?.price_id,
        )
      : currentSubscription?.price_id === tierPriceId);
  const isScheduled = isAuthenticated && currentSubscription?.has_schedule;
  const isScheduledTargetPlan =
    isScheduled &&
    // For custom tier, check if the selected plan matches the scheduled subscription
    (tier.name === 'Custom'
      ? tier.upgradePlans?.some(
          (plan) =>
            plan.hours === localSelectedPlan &&
            plan.stripePriceId === currentSubscription?.scheduled_price_id,
        )
      : currentSubscription?.scheduled_price_id === tierPriceId);
  const isPlanLoading = isLoading[tierPriceId];

  let buttonText = isAuthenticated ? 'Select Plan' : 'Try Free';
  let buttonDisabled = isPlanLoading;
  let buttonVariant: ButtonVariant = null;
  let ringClass = '';
  let statusBadge = null;
  let buttonClassName = '';

  if (isAuthenticated) {
    if (isCurrentActivePlan) {
      buttonText = 'Current Plan';
      buttonDisabled = true;
      buttonVariant = 'secondary';
      ringClass = isCompact ? 'ring-1 ring-primary' : 'ring-2 ring-primary';
      buttonClassName = 'bg-primary/5 hover:bg-primary/10 text-primary';
      statusBadge = (
        <span className="bg-primary/10 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded-full">
          Current
        </span>
      );
    } else if (isScheduledTargetPlan) {
      buttonText = 'Scheduled';
      buttonDisabled = true;
      buttonVariant = 'outline';
      ringClass = isCompact
        ? 'ring-1 ring-yellow-500'
        : 'ring-2 ring-yellow-500';
      buttonClassName =
        'bg-yellow-500/5 hover:bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      statusBadge = (
        <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
          Scheduled
        </span>
      );
    } else if (isScheduled && currentSubscription?.price_id === tierPriceId) {
      buttonText = 'Change Scheduled';
      buttonVariant = 'secondary';
      ringClass = isCompact ? 'ring-1 ring-primary' : 'ring-2 ring-primary';
      buttonClassName = 'bg-primary/5 hover:bg-primary/10 text-primary';
      statusBadge = (
        <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
          Downgrade Pending
        </span>
      );
    } else {
      // For custom tier, find the current plan in upgradePlans
      const currentTier =
        tier.name === 'Custom' && tier.upgradePlans
          ? tier.upgradePlans.find(
              (p) => p.stripePriceId === currentSubscription?.price_id,
            )
          : siteConfig.cloudPricingItems.find(
              (p) => p.stripePriceId === currentSubscription?.price_id,
            );

      // Find the highest active plan from upgradePlans
      const highestActivePlan = siteConfig.cloudPricingItems.reduce(
        (highest, item) => {
          if (item.upgradePlans) {
            const activePlan = item.upgradePlans.find(
              (p) => p.stripePriceId === currentSubscription?.price_id,
            );
            if (activePlan) {
              const activeAmount =
                parseFloat(activePlan.price.replace(/[^\d.]/g, '') || '0') *
                100;
              const highestAmount =
                parseFloat(highest?.price?.replace(/[^\d.]/g, '') || '0') * 100;
              return activeAmount > highestAmount ? activePlan : highest;
            }
          }
          return highest;
        },
        null as { price: string; hours: string; stripePriceId: string } | null,
      );

      const currentPriceString = currentSubscription
        ? highestActivePlan?.price || currentTier?.price || '$0'
        : '$0';
      const selectedPriceString = getSelectedPlanPrice(tier);
      const currentAmount =
        currentPriceString === '$0'
          ? 0
          : parseFloat(currentPriceString.replace(/[^\d.]/g, '') || '0') * 100;
      const targetAmount =
        selectedPriceString === '$0'
          ? 0
          : parseFloat(selectedPriceString.replace(/[^\d.]/g, '') || '0') * 100;

      if (
        currentAmount === 0 &&
        targetAmount === 0 &&
        currentSubscription?.status !== 'no_subscription'
      ) {
        buttonText = 'Select Plan';
        buttonDisabled = true;
        buttonVariant = 'secondary';
        buttonClassName = 'bg-primary/5 hover:bg-primary/10 text-primary';
      } else {
        if (targetAmount > currentAmount) {
          buttonText = 'Upgrade';
          buttonVariant = tier.buttonColor as ButtonVariant;
          buttonClassName =
            'bg-primary hover:bg-primary/90 text-primary-foreground';
        } else if (targetAmount < currentAmount) {
          buttonText = '-';
          buttonDisabled = true;
          buttonVariant = 'secondary';
          buttonClassName =
            'opacity-50 cursor-not-allowed bg-muted text-muted-foreground';
        } else {
          buttonText = 'Select Plan';
          buttonVariant = tier.buttonColor as ButtonVariant;
          buttonClassName =
            'bg-primary hover:bg-primary/90 text-primary-foreground';
        }
      }
    }

    if (isPlanLoading) {
      buttonText = 'Loading...';
      buttonClassName = 'opacity-70 cursor-not-allowed';
    }
  } else {
    // Non-authenticated state styling
    buttonVariant = tier.buttonColor as ButtonVariant;
    buttonClassName =
      tier.buttonColor === 'default'
        ? 'bg-primary hover:bg-primary/90 text-white'
        : 'bg-secondary hover:bg-secondary/90 text-white';
  }

  return (

    <Card className={`h-full flex flex-col ${
      tier.isPopular 
        ? "border-chart-1 relative before:absolute before:inset-0 before:rounded-lg before:bg-chart-1/5 before:-z-10 before:blur-xl"
        : ""
    }`}>
      {tier.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-chart-1 text-white text-xs font-semibold rounded-full">
          Most Popular
        </div>
      )}

      <CardHeader >
        <CardTitle className="text-2xl">
          {tier.name} {isAuthenticated && statusBadge}
        </CardTitle>
        <div className="flex items-baseline">
          {tier.name === 'Custom' ? (
            <CustomPriceDisplay
              price={getPriceValue(tier, localSelectedPlan)}
            />
          ) : (
            <PriceDisplay price={tier.price} />
          )}
        </div>
        <CardDescription className="mt-2">{tier.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">

        {tier.name === 'Custom' && tier.upgradePlans ? (
          <div className="w-full space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground">
              Customize your monthly usage
            </p>
            <Select value={localSelectedPlan} onValueChange={handlePlanSelect}>
              <SelectTrigger className="w-full bg-white dark:bg-background">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {tier.upgradePlans.map((plan) => (
                  <SelectItem
                    key={plan.hours}
                    value={plan.hours}
                    className={
                      localSelectedPlan === plan.hours
                        ? 'font-medium bg-primary/5'
                        : ''
                    }
                  >
                    {plan.hours} - {plan.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
          </div>
        ) : (
          <></>
        )}

        <ul className="space-y-3">
          {tier.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-chart-1 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>


      <CardFooter>
        <Button
          onClick={() => handleSubscribe(tierPriceId)}
          disabled={buttonDisabled}
          variant={tier.isPopular ? "default" : "outline"}
          className={cn(
            'w-full font-medium transition-all duration-200',
            isCompact ? 'h-7 text-xs' : 'h-10 text-sm',
            tier.isPopular ? "bg-primary" : "bg-background hover:bg-gray-100 text-foreground",
            isPlanLoading && 'animate-pulse',
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>

    </Card>
  );
}

interface PricingSectionProps {
  returnUrl?: string;
  showTitleAndTabs?: boolean;
}

export function PricingSection({
  returnUrl = typeof window !== 'undefined' ? window.location.href : '/',
  showTitleAndTabs = true,
}: PricingSectionProps) {
  const [deploymentType, setDeploymentType] = useState<'cloud' | 'self-hosted'>(
    'cloud',
  );
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isFetchingPlan, setIsFetchingPlan] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchCurrentPlan = async () => {
    setIsFetchingPlan(true);
    try {
      const subscriptionData = await getSubscription();
      console.log('Fetched Subscription Status:', subscriptionData);
      setCurrentSubscription(subscriptionData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setCurrentSubscription(null);
      setIsAuthenticated(false);
    } finally {
      setIsFetchingPlan(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setIsLoading((prev) => ({ ...prev, [planId]: true }));
  };

  const handleSubscriptionUpdate = () => {
    fetchCurrentPlan();
    setTimeout(() => {
      setIsLoading({});
    }, 1000);
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const handleTabChange = (tab: 'cloud' | 'self-hosted') => {
    if (tab === 'self-hosted') {
      const openSourceSection = document.getElementById('open-source');
      if (openSourceSection) {
        const rect = openSourceSection.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const offsetPosition = scrollTop + rect.top - 100;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    } else {
      setDeploymentType(tab);
    }
  };

  if (! isLocalMode()) {
    return (
      <div className="p-4 bg-muted/30 border border-border rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Running in local development mode - billing features are disabled
        </p>
      </div>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-muted/50">
      
      <div className="container px-4 md:px-6">

      {showTitleAndTabs && (
        <>
          <FadeIn>
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Choose the perfect plan to accelerate your learning journey.
              No hidden fees, cancel anytime.
            </p>
          </div>
        </FadeIn>

        </>
      )}

      {deploymentType === 'cloud' && (
        <FadeInStagger>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {siteConfig.cloudPricingItems.map((tier, index) => (
              <FadeInStaggerItem key={index}>
                <PricingTier
                  key={tier.name}
                  tier={tier}
                  currentSubscription={currentSubscription}
                  isLoading={isLoading}
                  isFetchingPlan={isFetchingPlan}
                  onPlanSelect={handlePlanSelect}
                  onSubscriptionUpdate={handleSubscriptionUpdate}
                  isAuthenticated={isAuthenticated}
                  returnUrl={returnUrl}
                />
              </FadeInStaggerItem>
            ))}
          </div>
        </FadeInStagger>
      )}

      </div>

    </section>
  );
}
