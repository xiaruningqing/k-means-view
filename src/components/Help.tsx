import React, { useState } from 'react';
import styled from 'styled-components';

const HelpContainer = styled.div`
  padding: 20px;
  background: #2a2a2a;
`;

const Question = styled.h5`
  cursor: pointer;
  color: #4a90e2;
`;

const Answer = styled.p`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  &.open {
    max-height: 200px;
  }
`;

const faqs = [
  { q: '什么是 K-means？', a: 'K-means 是一种迭代式聚类算法...' },
  { q: 'K 值如何选择？', a: 'K 值的选择对结果影响很大...' },
];

const Help: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <HelpContainer>
      <h4>常见问题 (FAQ)</h4>
      {faqs.map((faq, index) => (
        <div key={index}>
          <Question onClick={() => toggleFAQ(index)}>{faq.q}</Question>
          <Answer className={openIndex === index ? 'open' : ''}>{faq.a}</Answer>
        </div>
      ))}
    </HelpContainer>
  );
};

export default Help; 