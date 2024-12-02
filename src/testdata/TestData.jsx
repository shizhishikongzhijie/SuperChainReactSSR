//测试数据
const data = [
    {
        voteId: 1,
        creator: "0x1234567890", //投票发起者名称
        uploaderCount: 100,//投票人数,
        hasVotedCount: 76,//已投票人数
        title: "投票标题",
        privacy: 0, // 隐私度 0 or 1 or 2
        description: "投票描述",
        startDate: "2022-01-01 12:00:00",//更新时间
        limitDate: "2022-01-01 12:11:00",//截止时间
    },
    {
        voteId: 2,
        creator: "0x1234567890", //投票发起者名称
        uploaderCount: 100,//投票人数
        hasVotedCount: 25,//已投票人数
        title: "投票标题",
        privacy: 0, // 隐私度 0 or 1 or 2
        description: "投票描述",
        startDate: "2022-01-01 12:00:00",//更新时间
        limitDate: "2022-01-01 12:11:00",//截止时间
    },
    {
        voteId: 3,
        creator: "0x1234567890", //投票发起者名称
        uploaderCount: 100,//投票人数
        hasVotedCount: 0,//已投票人数
        title: "投票标题",
        privacy: 0, // 隐私度 0 or 1 or 2
        description: "投票描述",
        startDate: "2022-01-01 12:00:00",//更新时间
        limitDate: "2022-01-01 12:11:00",//截止时间
    }
]

export default data