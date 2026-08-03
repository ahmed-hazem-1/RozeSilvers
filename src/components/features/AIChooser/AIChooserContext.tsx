'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  AIChooserStep,
  AIChooserPreferences,
  AIChooserResponsePayload,
  RecipientType,
  OccasionType,
  JewelryCategory,
  StyleVibe,
  BudgetRange,
} from './types';
import { fetchAIRecommendations } from './services/aiAgentClient';

interface AIChooserContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  currentStep: AIChooserStep;
  setStep: (step: AIChooserStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  preferences: AIChooserPreferences;
  setRecipient: (recipient: RecipientType) => void;
  setOccasion: (occasion: OccasionType) => void;
  toggleCategory: (category: JewelryCategory) => void;
  setStyle: (style: StyleVibe) => void;
  setBudget: (budget: BudgetRange) => void;
  isLoading: boolean;
  error: string | null;
  results: AIChooserResponsePayload | null;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  canProceed: boolean;
}

const initialPreferences: AIChooserPreferences = {
  recipient: null,
  occasion: null,
  categories: [],
  style: null,
  budget: null,
};

const AIChooserContext = createContext<AIChooserContextType | undefined>(undefined);

export function AIChooserProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<AIChooserStep>(1);
  const [preferences, setPreferences] = useState<AIChooserPreferences>(initialPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AIChooserResponsePayload | null>(null);

  const openDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setRecipient = useCallback((recipient: RecipientType) => {
    setPreferences((prev) => ({ ...prev, recipient }));
  }, []);

  const setOccasion = useCallback((occasion: OccasionType) => {
    setPreferences((prev) => ({ ...prev, occasion }));
  }, []);

  const toggleCategory = useCallback((category: JewelryCategory) => {
    setPreferences((prev) => {
      const exists = prev.categories.includes(category);
      const newCategories = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  }, []);

  const setStyle = useCallback((style: StyleVibe) => {
    setPreferences((prev) => ({ ...prev, style }));
  }, []);

  const setBudget = useCallback((budget: BudgetRange) => {
    setPreferences((prev) => ({ ...prev, budget }));
  }, []);

  const canProceed = useMemo(() => {
    if (currentStep === 1) {
      return Boolean(preferences.recipient && preferences.occasion);
    }
    if (currentStep === 2) {
      return preferences.categories.length > 0;
    }
    if (currentStep === 3) {
      return Boolean(preferences.style);
    }
    if (currentStep === 4) {
      return Boolean(preferences.budget);
    }
    return true;
  }, [currentStep, preferences]);

  const submitQuiz = useCallback(async () => {
    if (!preferences.recipient || !preferences.occasion || !preferences.style || !preferences.budget) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAIRecommendations({
        locale,
        preferences: {
          recipient: preferences.recipient,
          occasion: preferences.occasion,
          categories: preferences.categories.length > 0 ? preferences.categories : ['necklaces', 'rings'],
          style: preferences.style,
          budget: preferences.budget,
        },
      });

      setResults(response);
      setCurrentStep(5); // Move to results step
    } catch (err: any) {
      console.error('Error submitting AI quiz:', err);
      setError(err?.message || 'Failed to curate pieces');
    } finally {
      setIsLoading(false);
    }
  }, [locale, preferences]);

  const nextStep = useCallback(() => {
    if (currentStep < 4 && canProceed) {
      setCurrentStep((prev) => ((prev + 1) as AIChooserStep));
    } else if (currentStep === 4 && canProceed) {
      submitQuiz();
    }
  }, [currentStep, canProceed, submitQuiz]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => ((prev - 1) as AIChooserStep));
    }
  }, [currentStep]);

  const resetQuiz = useCallback(() => {
    setPreferences(initialPreferences);
    setCurrentStep(1);
    setResults(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      openDrawer,
      closeDrawer,
      currentStep,
      setStep: setCurrentStep,
      nextStep,
      prevStep,
      preferences,
      setRecipient,
      setOccasion,
      toggleCategory,
      setStyle,
      setBudget,
      isLoading,
      error,
      results,
      submitQuiz,
      resetQuiz,
      canProceed,
    }),
    [
      isOpen,
      openDrawer,
      closeDrawer,
      currentStep,
      nextStep,
      prevStep,
      preferences,
      setRecipient,
      setOccasion,
      toggleCategory,
      setStyle,
      setBudget,
      isLoading,
      error,
      results,
      submitQuiz,
      resetQuiz,
      canProceed,
    ]
  );

  return <AIChooserContext.Provider value={value}>{children}</AIChooserContext.Provider>;
}

export function useAIChooser() {
  const context = useContext(AIChooserContext);
  if (!context) {
    throw new Error('useAIChooser must be used within an AIChooserProvider');
  }
  return context;
}
