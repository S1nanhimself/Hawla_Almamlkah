import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameContext } from '../context/GameContext';
import { FaPlus, FaTrash, FaPlay, FaCheck, FaClock } from 'react-icons/fa';
import { Category } from '../types';

interface SetupScreenProps {
  onStartGame: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const { 
    teams, 
    addTeam, 
    removeTeam, 
    availableCategories,
    selectedCategories,
    selectCategoryForTeam,
    removeCategoryFromTeam,
    areAllCategoriesSelected,
    finalizeCategories,
    questionTimerDuration,
    setQuestionTimerDuration
  } = useGameContext();
  
  const [newTeamName, setNewTeamName] = useState('');
  const [setupStage, setSetupStage] = useState<'teams' | 'categories'>('teams');
  const [activeTeamTab, setActiveTeamTab] = useState<string | null>(null);

  // Set the first team as active by default when switching to categories
  React.useEffect(() => {
    if (setupStage === 'categories' && teams.length > 0 && !activeTeamTab) {
      setActiveTeamTab(teams[0].id);
    }
  }, [setupStage, teams, activeTeamTab]);

  // Render icon functions
  const renderTrashIcon = () => {
    const trashIcon = FaTrash({ size: 16 });
    return trashIcon;
  };

  const renderPlusIcon = () => {
    const plusIcon = FaPlus({ size: 16 });
    return plusIcon;
  };

  const renderPlayIcon = () => {
    const playIcon = FaPlay({ size: 18 });
    return playIcon;
  };

  const renderCheckIcon = () => {
    const checkIcon = FaCheck({ size: 16 });
    return checkIcon;
  };

  const renderClockIcon = () => {
    const clockIcon = FaClock({ size: 16 });
    return clockIcon;
  };

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTeam();
    }
  };

  const handleContinueToCategories = () => {
    if (teams.length >= 2) {
      setSetupStage('categories');
    }
  };

  const handleStartGame = () => {
    if (areAllCategoriesSelected()) {
      finalizeCategories();
      onStartGame();
    }
  };

  // Get team's selected categories
  const getTeamCategories = (teamId: string) => {
    return selectedCategories[teamId] || [];
  };

  // Handle timer duration change
  const handleTimerDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setQuestionTimerDuration(value);
    }
  };

  // Render Teams Setup Screen
  const renderTeamsSetup = () => (
    <>
      <SetupTitle>إعداد اللعبة</SetupTitle>
      <SetupSubtitle>أضف الفِرق قبل البدء</SetupSubtitle>

      <TeamsList>
        {teams.map((team) => (
          <TeamItem key={team.id}>
            <TeamName>{team.name}</TeamName>
            <RemoveButton
              onClick={() => removeTeam(team.id)}
              disabled={teams.length <= 2}
              title="إزالة الفريق"
            >
              {renderTrashIcon()}
            </RemoveButton>
          </TeamItem>
        ))}
      </TeamsList>

      <AddTeamContainer>
        <TeamInput
          type="text"
          placeholder="اسم الفريق الجديد"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <AddButton onClick={handleAddTeam} disabled={!newTeamName.trim()}>
          {renderPlusIcon()}
        </AddButton>
      </AddTeamContainer>

      {/* Timer Settings Section */}
      <SettingsSection>
        <SectionTitle>إعدادات المؤقت</SectionTitle>
        <SettingsRow>
          <SettingsLabel>
            {renderClockIcon()} مدة السؤال (ثواني):
          </SettingsLabel>
          <SettingsControl>
            <RangeInput 
              type="range" 
              min="10" 
              max="120" 
              step="5"
              value={questionTimerDuration} 
              onChange={handleTimerDurationChange}
            />
            <RangeValue>{questionTimerDuration} ثانية</RangeValue>
          </SettingsControl>
        </SettingsRow>
      </SettingsSection>

      <StartGameButton onClick={handleContinueToCategories} disabled={teams.length < 2}>
        {renderCheckIcon()}
        <span>استمر لاختيار الفئات</span>
      </StartGameButton>
    </>
  );

  // Render Category Selection Screen
  const renderCategorySelection = () => {
    // Get the currently active team
    const activeTeam = teams.find(team => team.id === activeTeamTab);
    if (!activeTeam) return null;
    
    const teamCategories = getTeamCategories(activeTeam.id);
    const hasSelectedAllCategories = teamCategories.length === 3;

    return (
      <>
        <SetupTitle>اختيار الفئات</SetupTitle>
        <SetupSubtitle>يجب على كل فريق اختيار 3 فئات</SetupSubtitle>

        <TeamTabs>
          {teams.map(team => {
            const teamCats = getTeamCategories(team.id);
            return (
              <TeamTab 
                key={team.id} 
                $isActive={team.id === activeTeamTab}
                $isComplete={teamCats.length === 3}
                onClick={() => setActiveTeamTab(team.id)}
              >
                {team.name} ({teamCats.length}/3)
              </TeamTab>
            );
          })}
        </TeamTabs>

        <CategorySelectionContainer>
          <TeamCategoriesSection>
            <SectionTitle>فئات مختارة - {activeTeam.name}</SectionTitle>
            <SelectedCategoriesGrid>
              {teamCategories.map(category => (
                <SelectedCategoryItem key={category.id}>
                  <CategoryName>{category.nameAr}</CategoryName>
                  <RemoveButton onClick={() => removeCategoryFromTeam(activeTeam.id, category.id)}>
                    {renderTrashIcon()}
                  </RemoveButton>
                </SelectedCategoryItem>
              ))}
              {[...Array(3 - teamCategories.length)].map((_, index) => (
                <EmptyCategorySlot key={index}>
                  <EmptySlotText>اختر فئة</EmptySlotText>
                </EmptyCategorySlot>
              ))}
            </SelectedCategoriesGrid>
          </TeamCategoriesSection>

          {!hasSelectedAllCategories && (
            <AvailableCategoriesSection>
              <SectionTitle>الفئات المتاحة</SectionTitle>
              <AvailableCategoriesGrid>
                {availableCategories.map(category => (
                  <CategoryOption 
                    key={category.id}
                    onClick={() => selectCategoryForTeam(activeTeam.id, category.id)}
                  >
                    {category.nameAr}
                  </CategoryOption>
                ))}
              </AvailableCategoriesGrid>
            </AvailableCategoriesSection>
          )}
        </CategorySelectionContainer>

        <ProgressIndicator>
          {teams.every(team => getTeamCategories(team.id).length === 3) ? (
            <ProgressComplete>جميع الفرق جاهزة!</ProgressComplete>
          ) : (
            <ProgressIncomplete>
              {teams.filter(team => getTeamCategories(team.id).length === 3).length} من {teams.length} فرق جاهزة
            </ProgressIncomplete>
          )}
        </ProgressIndicator>

        <ButtonGroup>
          <SecondaryButton onClick={() => setSetupStage('teams')}>
            العودة لتعديل الفرق
          </SecondaryButton>
          <StartGameButton 
            onClick={handleStartGame} 
            disabled={!areAllCategoriesSelected()}
          >
            {renderPlayIcon()}
            <span>ابدأ اللعبة!</span>
          </StartGameButton>
        </ButtonGroup>
      </>
    );
  };

  return (
    <SetupContainer>
      <SetupCard>
        {setupStage === 'teams' ? renderTeamsSetup() : renderCategorySelection()}

        <SetupInstructions>
          <ul>
            <li>كل فريق يختار 3 فئات مختلفة من الأسئلة</li>
            <li>كل فريق يأخذ دوره في اختيار سؤال</li>
            <li>لكل فئة 6 أسئلة بقيم نقاط متفاوتة (200، 400، 600)</li>
            <li>الفريق الذي يجيب إجابة صحيحة يحصل على النقاط</li>
            <li>يتغير الدور بعد كل سؤال</li>
            <li>لكل فريق 3 مساعدات يمكن استخدامها مرة واحدة في اللعبة</li>
          </ul>
        </SetupInstructions>
      </SetupCard>
    </SetupContainer>
  );
};

const SetupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height));
  padding: 20px;
  background-color: var(--bg-color);
`;

const SetupCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 32px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: ${props => props.theme.isMobile ? '0' : 'var(--border-radius)'};
    box-shadow: ${props => props.theme.isMobile ? 'none' : '0 6px 30px rgba(0, 0, 0, 0.1)'};
    max-width: ${props => props.theme.isMobile ? '100%' : '800px'};
  }
`;

const SetupTitle = styled.h2`
  font-size: 28px;
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 8px;
`;

const SetupSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 20px;
`;

const TeamsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 4px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--tile-bg);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--secondary-color);
    border-radius: 4px;
  }
`;

const TeamItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--tile-bg);
  padding: 14px 18px;
  border-radius: var(--border-radius);
  border: 1px solid var(--secondary-color);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TeamName = styled.div`
  font-weight: bold;
  color: var(--primary-color);
  font-size: 16px;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #ff6666;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 102, 102, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    background-color: transparent;
    transform: none;
  }
`;

const AddTeamContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const TeamInput = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  font-size: 16px;
  background-color: white;
  transition: all 0.2s;
  color: var(--text-color);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(89, 61, 41, 0.2);
  }
  
  &::placeholder {
    color: #aaa;
  }
`;

const AddButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StartGameButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SetupInstructions = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: var(--tile-bg);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  color: var(--text-color);

  ul {
    list-style-position: inside;
    padding-right: 16px;
    list-style-type: disc;

    li {
      margin-bottom: 8px;
      line-height: 1.4;
    }
  }
`;

// Team tabs for category selection
interface TeamTabProps {
  $isActive: boolean;
  $isComplete: boolean;
}

const TeamTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const TeamTab = styled.button<TeamTabProps>`
  padding: 10px 16px;
  background-color: ${props => 
    props.$isActive 
      ? 'var(--primary-color)' 
      : props.$isComplete 
        ? 'rgba(197, 170, 106, 0.2)'
        : 'var(--tile-bg)'};
  color: ${props => props.$isActive ? 'white' : props.$isComplete ? 'var(--primary-color)' : 'var(--text-color)'};
  border: 1px solid ${props => 
    props.$isActive 
      ? 'var(--primary-color)' 
      : props.$isComplete 
        ? 'var(--lifeline-color)' 
        : 'var(--secondary-color)'};
  border-radius: var(--border-radius);
  font-weight: ${props => props.$isActive ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${props => 
      props.$isActive 
        ? 'var(--primary-color)' 
        : props.$isComplete 
          ? 'rgba(197, 170, 106, 0.3)'
          : 'var(--tile-hover)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

// New components for category selection
const CategorySelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TeamCategoriesSection = styled.div`
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 16px;
`;

const AvailableCategoriesSection = styled.div`
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 16px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--primary-color);
`;

const SelectedCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const SelectedCategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(89, 61, 41, 0.15);
  padding: 12px;
  border-radius: var(--border-radius);
  min-height: 60px;
  border: 1px solid rgba(89, 61, 41, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: rgba(89, 61, 41, 0.2);
  }
`;

const EmptyCategorySlot = styled.div`
  background-color: var(--tile-bg);
  border: 2px dashed var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border-radius: var(--border-radius);
`;

const EmptySlotText = styled.span`
  color: var(--secondary-color);
  font-size: 14px;
`;

const CategoryName = styled.div`
  font-weight: bold;
  color: var(--primary-color);
`;

const AvailableCategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
`;

const CategoryOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  background-color: var(--tile-bg);
  color: var(--primary-color);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 60px;
  font-weight: bold;

  &:hover {
    background-color: var(--tile-hover);
    border-color: var(--primary-color);
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProgressIndicator = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 16px;
`;

const ProgressComplete = styled.div`
  color: var(--primary-color);
  font-weight: bold;
`;

const ProgressIncomplete = styled.div`
  color: var(--secondary-color);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SecondaryButton = styled.button`
  flex: 1;
  background-color: var(--tile-bg);
  color: var(--text-color);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--tile-hover);
  }
`;

// New styled components for settings
const SettingsSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background-color: var(--tile-bg);
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
`;

const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: var(--primary-color);
`;

const SettingsControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RangeInput = styled.input`
  width: 200px;
  accent-color: var(--primary-color);
  height: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;

const RangeValue = styled.div`
  min-width: 80px;
  text-align: center;
  font-weight: bold;
  color: var(--primary-color);
  background-color: rgba(89, 61, 41, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
`;

export default SetupScreen; 