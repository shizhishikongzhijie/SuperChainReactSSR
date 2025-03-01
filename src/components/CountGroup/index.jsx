import React, {useEffect, useState} from "react";

const CountGroup = ({countVoteData}) => {
    // 将 question 和 result 转换为数组形式
    const [questions, setQuestions] = useState(Object.entries(countVoteData?.question || {}));

    const [results, setResults] = useState(countVoteData?.result || {});
// 生成随机颜色的函数
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const getWidth = (questionKey, optionIndex) => {
        let sum = results[questionKey]?.reduce((acc, cur) => acc + cur, 0);
        let percent = results[questionKey]?.[optionIndex] / sum;
        return percent * 100;
    };
    useEffect(() => {
        console.log(countVoteData);
        setQuestions(Object.entries(countVoteData?.question || {}));
        setResults(countVoteData?.result || {});
    }, [countVoteData]);
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            {questions.length > 0 ? (
                questions.map(([questionKey, options], index) => (
                    <div key={questionKey} style={{marginBottom: '10px'}}>
                        <div style={{
                            fontSize: 'large',
                            fontWeight: 700
                        }}>{questionKey}</div>
                        <div style={{display: 'flex', flexDirection: 'row', marginBottom: '5px'}}>
                            {options.map((option, optionIndex) => (
                                <div key={`${questionKey}-${optionIndex}`} style={{
                                    color: 'white',
                                    backgroundColor: getRandomColor(),
                                    width: getWidth(questionKey, optionIndex)
                                }}>
                                    {results[questionKey]?.[optionIndex] !== 0 ? `${option}-${results[questionKey]?.[optionIndex]}` : ''}</div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div>No questions available</div>
            )}
        </div>
    );

};

export default CountGroup;
