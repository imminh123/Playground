import { useState, useRef } from 'react';
import { ArrowLeft, Search, Sparkles, Send, AtSign, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { FileIcon } from './FileIcon';
import type { Companion, Skill, KnowledgeRetrievalConfig, PlanningConfig } from '../types';

function CompanionCard({ companion, onClick }: { companion: Companion; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full p-6 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--radius-xl)] text-left hover:border-[var(--color-border-default)] hover:shadow-[var(--shadow-md)] transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-tag-violet)] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">{companion.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {companion.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {companion.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function SkillConfig({
  skill,
  isEnabled,
  onToggle,
}: {
  skill: Skill;
  isEnabled: boolean;
  onToggle: () => void;
}) {
  const { assets, experienceInventories, updateSkill } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const isKnowledgeRetrieval = skill.type === 'knowledge-retrieval';
  const config = skill.config as KnowledgeRetrievalConfig | PlanningConfig;

  const allAssets = assets;
  const selectedAssetIds = isKnowledgeRetrieval
    ? (config as KnowledgeRetrievalConfig).assetIds
    : [];

  const selectedInventory = !isKnowledgeRetrieval
    ? experienceInventories.find((inv) => inv.id === (config as PlanningConfig).experienceInventoryId)
    : null;

  const toggleAsset = (assetId: string) => {
    if (!isKnowledgeRetrieval) return;
    const currentConfig = config as KnowledgeRetrievalConfig;
    const newAssetIds = currentConfig.assetIds.includes(assetId)
      ? currentConfig.assetIds.filter((id) => id !== assetId)
      : [...currentConfig.assetIds, assetId];
    updateSkill(skill.id, { config: { assetIds: newAssetIds } });
  };

  const selectInventory = (inventoryId: string | null) => {
    if (isKnowledgeRetrieval) return;
    updateSkill(skill.id, { config: { experienceInventoryId: inventoryId } });
    setIsOpen(false);
  };

  return (
    <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 ${
            isKnowledgeRetrieval
              ? 'bg-[var(--color-info-muted)]'
              : 'bg-[var(--color-tag-violet-bg)]'
          }`}>
            {isKnowledgeRetrieval ? (
              <Search size={20} className="text-[var(--color-info)]" />
            ) : (
              <Sparkles size={20} className="text-[var(--color-tag-violet)]" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text-primary)]">{skill.name}</h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{skill.description}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`
            relative w-10 h-6 rounded-full transition-colors flex-shrink-0
            ${isEnabled ? 'bg-[var(--color-accent-primary)]' : 'bg-[var(--color-border-default)]'}
          `}
        >
          <span
            className={`
              absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm
              ${isEnabled ? 'left-5' : 'left-1'}
            `}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
          {isKnowledgeRetrieval ? (
            <div>
              <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Linked Documents & Folders
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {allAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={`
                      px-2.5 py-1 rounded-md text-xs font-medium border transition-all flex items-center gap-1.5
                      ${selectedAssetIds.includes(asset.id)
                        ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]'
                        : 'bg-[var(--color-bg-primary)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-default)]'
                      }
                    `}
                  >
                    <FileIcon type={asset.type} size={12} />
                    {asset.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <label className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Experience Inventory
              </label>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-2 w-full h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] flex items-center justify-between gap-2 text-left hover:border-[var(--color-border-default)] transition-colors"
              >
                <span className={`text-sm ${selectedInventory ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                  {selectedInventory?.name || 'Select an inventory...'}
                </span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute z-50 top-full left-0 right-0 mt-1 py-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] max-h-[200px] overflow-y-auto"
                  >
                    <button
                      onClick={() => selectInventory(null)}
                      className="w-full px-3 py-2 flex items-center justify-between text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                      None
                    </button>
                    {experienceInventories.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => selectInventory(inv.id)}
                        className="w-full px-3 py-2 flex items-center justify-between text-left text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                      >
                        {inv.name}
                        {(config as PlanningConfig).experienceInventoryId === inv.id && (
                          <Check size={14} className="text-[var(--color-accent-primary)]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompanionChat({ companion }: { companion: Companion }) {
  const { skills, toggleCompanionSkill, setSelectedCompanion } = useStore();
  const [prompt, setPrompt] = useState('You are a helpful assistant for the boat fair. Help visitors find information about events, exhibits, and schedules. When asked about technical boat details, use @Document Search to find accurate information. For planning activities, use @Event Planner to organize schedules.');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableSkillsForMention = skills.filter((skill) => skill.enabled);

  const filteredMentionSkills = availableSkillsForMention.filter((skill) =>
    skill.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);

    // Check for @ mention
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = value.slice(lastAtIndex + 1);
      const hasSpaceAfterMention = textAfterAt.includes(' ');
      if (!hasSpaceAfterMention) {
        setMentionSearch(textAfterAt);
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertSkillMention = (skill: Skill) => {
    const lastAtIndex = prompt.lastIndexOf('@');
    const newPrompt = prompt.slice(0, lastAtIndex) + `@${skill.name} `;
    setPrompt(newPrompt);
    setShowMentionDropdown(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentionDropdown && e.key === 'Escape') {
      setShowMentionDropdown(false);
    }
    if (showMentionDropdown && e.key === 'Enter' && filteredMentionSkills.length > 0) {
      e.preventDefault();
      insertSkillMention(filteredMentionSkills[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedCompanion(null)}
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-tag-violet)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{companion.avatar}</span>
          </div>
          <div>
            <h2 className="font-semibold text-[var(--color-text-primary)]">{companion.name}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">{companion.description}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Configuration - Left Column */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                Skills
              </h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <SkillConfig
                    key={skill.id}
                    skill={skill}
                    isEnabled={companion.skillIds.includes(skill.id)}
                    onToggle={() => toggleCompanionSkill(companion.id, skill.id)}
                  />
                ))}
              </div>
            </div>

            {/* Instruction - Right Column */}
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4">
                Instruction
              </h3>

              <div className="relative">
                <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--radius-xl)] overflow-hidden focus-within:border-[var(--color-accent-primary)] focus-within:ring-1 focus-within:ring-[var(--color-accent-primary)] transition-all">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handlePromptChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter instructions for the companion... Use @ to reference skills"
                    rows={6}
                    className="w-full px-4 py-3 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none"
                  />
                  <div className="px-4 py-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <AtSign size={14} />
                      <span>Type @ to mention a skill (optional)</span>
                    </div>
                    <button
                      disabled={!prompt.trim()}
                      className={`
                        p-2 rounded-[var(--radius-md)] transition-colors
                        ${prompt.trim()
                          ? 'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-hover)]'
                          : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed'
                        }
                      `}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Mention Dropdown */}
                <AnimatePresence>
                  {showMentionDropdown && filteredMentionSkills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute bottom-full left-0 right-0 mb-2 py-1 bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] max-h-[200px] overflow-y-auto"
                    >
                      <div className="px-3 py-2 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        Available Skills
                      </div>
                      {filteredMentionSkills.map((skill) => (
                        <button
                          key={skill.id}
                          onClick={() => insertSkillMention(skill)}
                          className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-[var(--color-bg-hover)] transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center ${
                            skill.type === 'knowledge-retrieval'
                              ? 'bg-[var(--color-info-muted)]'
                              : 'bg-[var(--color-tag-violet-bg)]'
                          }`}>
                            {skill.type === 'knowledge-retrieval' ? (
                              <Search size={16} className="text-[var(--color-info)]" />
                            ) : (
                              <Sparkles size={16} className="text-[var(--color-tag-violet)]" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{skill.name}</p>
                            <p className="text-xs text-[var(--color-text-secondary)]">{skill.description}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompanionTab() {
  const { companions, selectedCompanionId, setSelectedCompanion } = useStore();

  const selectedCompanion = companions.find((c) => c.id === selectedCompanionId);

  if (selectedCompanion) {
    return <CompanionChat companion={selectedCompanion} />;
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-[var(--color-bg-secondary)]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
            Companions
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Choose a companion to help you with your tasks
          </p>
        </div>

        <div className="grid gap-4">
          {companions.map((companion, index) => (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CompanionCard
                companion={companion}
                onClick={() => setSelectedCompanion(companion.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
