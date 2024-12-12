import { saveAs } from 'file-saver';

function downloadTextWithFileSaver(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    saveAs(blob, filename);
}
// 使用示例
// downloadTextWithFileSaver('这是一个测试文本', 'test.txt', 'text/plain');

export { downloadTextWithFileSaver };