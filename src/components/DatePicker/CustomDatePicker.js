import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

// 改进后的 range 函数
function range(start, end) {
    const result = [];
    if (start > end) return result; // 处理 start > end 的情况
    for (let i = start; i <= end; i++) { // 包括 end 值
        result.push(i);
    }
    return result;
}

function getTodayTimestamps() {
    const now = dayjs();
    return {
        hour: now.hour(),
        minute: now.minute(),
        second: now.second()
    };
}

function disabledDate(current) {
    // Can not select days before today and today
    return current && current <= dayjs().endOf('day');
}

function disabledRangeTime(_, type) {
    const { hour, minute, second } = getTodayTimestamps();
    if (type === 'start') {
        return {
            disabledHours: () => range(0, hour),
            disabledMinutes: () => range(0, minute),
            disabledSeconds: () => range(0, second),
        };
    }
}

function CustomDatePicker(props) {
    let [disabledDateSource, setDisabledDateSource]= useState();
    let [disabledRangeTimeSource, setDisabledRangeTimeSource] = useState();
    useEffect(() => {
        setDisabledDateSource(disabledDate);
        setDisabledRangeTimeSource(disabledRangeTime);
    }, []);
    return (
        <>
            <RangePicker
                disabledDate={disabledDateSource}
                disabledTime={disabledRangeTimeSource}
                showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                }}
                format="YYYY-MM-DD HH:mm:ss"
            />
        </>
    );
};

export default CustomDatePicker;