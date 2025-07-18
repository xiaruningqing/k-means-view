import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PageContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 1.5rem 2rem;
  height: calc(100vh - 61px); // Full height minus navbar
  color: #fff;
  background-color: #121212;
`;

const MainContent = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const VideoPlayerContainer = styled.div`
  background: #000;
  border-radius: 8px;
  aspect-ratio: 16 / 9;
  width: 100%;
  border: 1px solid #333;
  overflow: hidden;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const CourseContentContainer = styled.div`
  background: #1f1f1f;
  border-radius: 8px;
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
`;

const NotesContainer = styled.aside`
  flex: 2;
  background: #1f1f1f;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isActive ? '#fff' : '#aaa'};
  padding: 0.8rem 0;
  cursor: pointer;
  font-size: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.isActive ? '#4a90e2' : 'transparent'};
    transition: background-color 0.2s ease-in-out;
  }
`;

const ChapterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0 0;
  overflow-y: auto;
`;

const ChapterItem = styled.li<{ isActive: boolean }>`
  padding: 1rem;
  background: ${props => props.isActive ? '#4a90e2' : 'transparent'};
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s ease-in-out;
  font-weight: 500;

  &:hover {
    background: #2a5a8a;
  }
`;

const NotesHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const NotesTitle = styled.h2`
    margin: 0;
    font-size: 1.2rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
    background: ${props => props.primary ? '#4a90e2' : '#333'};
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    &:hover {
        opacity: 0.9;
    }
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const TextArea = styled.textarea`
    flex: 1;
    background: #2a2a2a;
    border: 1px solid #444;
    color: #fff;
    padding: 15px;
    border-radius: 5px;
    resize: none;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6;
`;

const MarkdownContainer = styled.div`
    flex: 1;
    background: #2a2a2a;
    border: 1px solid #444;
    color: #fff;
    padding: 15px;
    border-radius: 5px;
    line-height: 1.6;
    overflow-y: auto;

    h3 {
        font-size: 1.2em;
        border-bottom: 1px solid #555;
        padding-bottom: 0.5em;
    }

    strong {
        color: #4a90e2;
    }

    ul {
        padding-left: 20px;
    }
`;

const QuizContent = styled.div`
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
`;

const Question = styled.div`
    margin-bottom: 2rem;
    h4 {
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
`;

const OptionFeedback = styled.label<{ isRevealed?: boolean, isSelected?: boolean, isCorrect?: boolean }>`
    display: block;
    padding: 0.8rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 5px;
    border: 1px solid #444;
    transition: background 0.3s, border-color 0.3s;
    cursor: ${props => props.isRevealed ? 'default' : 'pointer'};
    background: ${props => {
        if (!props.isRevealed) return '#2a2a2a';
        if (props.isCorrect) return '#28a745'; // Correct answer is always green
        if (props.isSelected) return '#dc3545'; // Incorrectly selected is red
        return '#2a2a2a'; // Default for non-selected, non-correct revealed options
    }};
    border-color: ${props => {
        if (!props.isRevealed) return '#444';
        if (props.isCorrect) return '#28a745';
        if (props.isSelected) return '#dc3545';
        return '#444';
    }};

    &:hover {
        background: ${props => !props.isRevealed && '#3a3a3a'};
    }

    input {
        margin-right: 10px;
    }
`;

const QuizControls = styled.div`
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
`;

const QuizSummary = styled.div`
    text-align: center;
    padding: 2rem;
    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
`;

interface VideoChapter {
  id: string;
  title: string;
  embedUrl: string;
  summary: string;
}

const chapters: VideoChapter[] = [
  {
    id: 'kmeans_1min',
    title: '一分钟搞懂K-means聚类算法',
    embedUrl: '//player.bilibili.com/player.html?bvid=BV1jdcteAEur&page=1&high_quality=1&danmaku=0',
    summary: `### K-means 核心思想

K-means 是一种经典的无监督聚类算法，目标是将n个数据点划分到k个聚类中。

**核心步骤:**
1.  **初始化**: 随机选择k个数据点作为初始聚类中心。
2.  **分配**: 计算每个数据点到各个聚类中心的距离（通常是欧氏距离），并将其分配给最近的聚类中心。
3.  **更新**: 重新计算每个聚类的质心（即该聚类所有数据点的平均值），将其作为新的聚类中心。
4.  **迭代**: 重复步骤2和3，直到聚类中心不再发生显著变化，或达到预设的迭代次数。

**优点:**
*   算法简单，易于实现。
*   对于处理大数据集，该算法是相对可伸缩和高效的。

**缺点:**
*   需要预先指定k值。
*   对初始聚类中心的选择很敏感。
*   对异常值和噪声敏感。
*   不适合非球形的簇。`
  },
  {
    id: 'kmeans_2hr',
    title: '两小时学完K-means算法（项目实战）',
    embedUrl: '//player.bilibili.com/player.html?bvid=BV1V44y1u7mJ&page=1&high_quality=1&danmaku=0',
    summary: `### K-means 项目实战要点

**1. 数据预处理**
*   **特征缩放 (Feature Scaling)**: K-means基于距离计算，不同特征的尺度差异会影响结果。使用标准化（Standardization）或归一化（Normalization）至关重要。
*   **处理异常值**: 异常值会严重扭曲聚类中心的位置，需要预先识别和处理（如移除或替换）。

**2. 选择合适的 K 值**
*   **肘部法则 (Elbow Method)**: 计算不同k值下的SSE（误差平方和），绘制曲线，曲线斜率变化最大的点（手肘处）即为最佳k值。
*   **轮廓系数 (Silhouette Coefficient)**: 衡量一个数据点与其所属簇的紧密程度，以及与其他簇的分离程度。轮廓系数越高，聚类效果越好。

**3. 初始化方法的选择**
*   **随机初始化**: 简单但可能导致局部最优解。
*   **K-means++**: 一种更优的初始化策略。它会选择相互之间距离较远的初始中心点，有助于获得更好的聚类结果和更快的收敛速度。本项目中已将 K-means++ 作为默认选项。

**4. 结果评估与应用**
*   **可视化分析**: 将聚类结果可视化是评估效果的最直观方法。
*   **业务应用**: 聚类结果可用于用户分群、图像分割、异常检测等多种场景。例如，在电商领域，可以根据用户的购买行为将其分群，从而进行精准营销。`
  }
];

const quizQuestions = [
    {
        question: "1. K-Means算法是一种监督学习还是无监督学习算法？",
        options: ["监督学习", "无监督学习", "半监督学习", "强化学习"],
        answer: "无监督学习"
    },
    {
        question: "2. 在K-Means算法中，'K'代表什么？",
        options: ["迭代次数", "数据点的总数", "聚类的数量", "特征维度"],
        answer: "聚类的数量"
    },
    {
        question: "3. '肘部法则'（Elbow Method）在K-Means中通常用来做什么？",
        options: ["评估聚类的最终性能", "选择合适的初始聚类中心", "确定最佳的K值", "对数据进行降维"],
        answer: "确定最佳的K值"
    },
    {
        question: "4. 以下哪个不是K-Means算法的缺点？",
        options: ["需要预先指定K值", "对初始中心点的选择敏感", "算法实现复杂，难以理解", "对于非球形的簇效果不佳"],
        answer: "算法实现复杂，难以理解"
    },
    {
        question: "5. K-Means++相对于随机初始化聚类中心，其主要优势是什么？",
        options: ["运行速度更快", "不需要指定K值", "有助于选择更优的初始中心，避免局部最优解", "可以处理任何形状的簇"],
        answer: "有助于选择更优的初始中心，避免局部最优解"
    }
];

const VideoCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chapters');
  const [activeChapter, setActiveChapter] = useState<VideoChapter>(chapters[0]);
  const [notesContent, setNotesContent] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(true);

  // State for the interactive quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    // Prevent changing the answer once selected
    if (selectedAnswers[questionIndex] === undefined) {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    }
  };

  const handleResetQuiz = () => {
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
  };
  
  const renderQuizContent = () => {
    const isQuizFinished = currentQuestionIndex >= quizQuestions.length;

    if (isQuizFinished) {
        const correctAnswersCount = Object.keys(selectedAnswers).reduce((count, key) => {
            const questionIndex = parseInt(key, 10);
            if (quizQuestions[questionIndex].answer === selectedAnswers[questionIndex]) {
                return count + 1;
            }
            return count;
        }, 0);

        return (
            <QuizSummary>
                <h3>测试完成！</h3>
                <p>你答对了 {correctAnswersCount} / {quizQuestions.length} 题。</p>
                <Button primary onClick={handleResetQuiz}>再试一次</Button>
            </QuizSummary>
        );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const hasAnsweredCurrent = selectedAnswers[currentQuestionIndex] !== undefined;

    return (
        <QuizContent>
            <Question key={currentQuestionIndex}>
                <h4>{currentQuestion.question}</h4>
                {currentQuestion.options.map(opt => (
                    <OptionFeedback 
                        key={opt}
                        isRevealed={hasAnsweredCurrent}
                        isSelected={selectedAnswers[currentQuestionIndex] === opt}
                        isCorrect={currentQuestion.answer === opt}
                    >
                        <input 
                            type="radio" 
                            name={`question-${currentQuestionIndex}`} 
                            value={opt}
                            checked={selectedAnswers[currentQuestionIndex] === opt}
                            disabled={hasAnsweredCurrent}
                            onChange={() => handleAnswerSelect(currentQuestionIndex, opt)}
                        />
                        {opt}
                    </OptionFeedback>
                ))}
            </Question>
            <QuizControls>
                {hasAnsweredCurrent && (
                     <Button primary onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
                        {currentQuestionIndex === quizQuestions.length - 1 ? '完成测试' : '下一题'}
                    </Button>
                )}
            </QuizControls>
        </QuizContent>
    );
  };

  const handleGenerateNotes = () => {
    setIsGeneratingNotes(true);
    setNotesContent('AI正在玩命总结中，请稍候...');
    setTimeout(() => {
        setNotesContent(activeChapter.summary);
        setIsGeneratingNotes(false);
        setIsEditingNotes(false); // Switch to preview mode after generating
    }, 2000);
  };

  return (
    <PageContainer>
      <MainContent>
        <VideoPlayerContainer>
           <Iframe src={`https:${activeChapter.embedUrl}`} allowFullScreen></Iframe>
        </VideoPlayerContainer>

        <CourseContentContainer>
          <TabContainer>
            <Tab isActive={activeTab === 'chapters'} onClick={() => setActiveTab('chapters')}>
              课程章节
            </Tab>
            <Tab isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
              课程详情
            </Tab>
            <Tab isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
              互动问答
            </Tab>
          </TabContainer>

          {activeTab === 'chapters' && (
            <ChapterList>
              {chapters.map(chapter => (
                <ChapterItem 
                  key={chapter.id} 
                  isActive={activeChapter.id === chapter.id}
                  onClick={() => setActiveChapter(chapter)}
                >
                  {chapter.title}
                </ChapterItem>
              ))}
            </ChapterList>
          )}
          {activeTab === 'summary' && (
            <MarkdownContainer>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeChapter.summary}</ReactMarkdown>
            </MarkdownContainer>
          )}
          {activeTab === 'quiz' && renderQuizContent()}
        </CourseContentContainer>
      </MainContent>
      <NotesContainer>
        <NotesHeader>
            <NotesTitle>课堂笔记</NotesTitle>
            <ButtonGroup>
                <Button onClick={handleGenerateNotes} disabled={isGeneratingNotes} primary>
                    {isGeneratingNotes ? '生成中...' : 'AI生成笔记'}
                </Button>
                <Button onClick={() => setIsEditingNotes(p => !p)}>
                    {isEditingNotes ? '预览笔记' : '编辑笔记'}
                </Button>
            </ButtonGroup>
        </NotesHeader>
        {isEditingNotes ? (
            <TextArea 
                placeholder='点击“AI生成笔记”自动总结视频内容，或在此手动记录...'
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
            />
        ) : (
             <MarkdownContainer onClick={() => setIsEditingNotes(true)}>
                {notesContent ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{notesContent}</ReactMarkdown>
                ) : (
                    <p style={{ color: '#888', textAlign: 'center', paddingTop: '2rem' }}>
                        空空如也，点击“编辑笔记”开始记录吧！
                    </p>
                )}
            </MarkdownContainer>
        )}
      </NotesContainer>
    </PageContainer>
  );
};

export default VideoCenterPage;