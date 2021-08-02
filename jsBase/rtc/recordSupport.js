function Support() {
    let AC = window.AudioContext || window.webkitAudioContext  
    if(!AC){
		return false;
    }
    
    let scope = navigator.mediaDevices || {}
    if (!scope.getUserMedia) {
        scope = navigator
        scope.getUserMedia = scope.getUserMedia || scope.webkitGetUserMedia || scope.mozGetUserMedia || scope.msGetUserMedia
    }

    if (!scope.getUserMedia) {
        return false
    }

    scope.getUserMedia(
        { audio: true, },
        (stream,) => {
            
        },
        (e) => {
            return false
        },
    )
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStreamTrack




// Int16Array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array

// https://www.jb51.cc/webfrontend/454312.html
// pcm Pulse Code Modulation 脉冲编码调制
// 模拟信号数字化需要经过三个过程，即抽样、量化和编码
// https://www.jb51.cc/webfrontend/454312.html
// 采样率
// 又可以称为采样频率，我们可以通过sampleRate得到输入的采样率：
// (new AudioContext()).sampleRate
// https://www.jb51.cc/res/2019/04-15/21/b64c4943218dab38b3aa8c48c329ed4a.png
// 即横向坐标(可以理解为x轴)在单位时间内采集了48000(sampleRate)次样本。
// 因为采集的样本多，所以未处理的pcm编码占的空间都比较大，但是他未经过任何编码和压缩处理，是种无损压缩的格式，也能得到相当好的音质效果。
// 采样频率一般共分为22.05KHz、44.1KHz、48KHz三个等级，采样频率越高，音质越精确。
// 正常人听觉的频率范围大约在20Hz~20kHz之间，根据奈奎斯特采样理论（只有采样频率高于声音信号最高频率的两倍时，才能把数字信号表示的声音还原成为原来的声音），为了保证声音不失真，采样频率应该在40kHz左右。所以对于高于48KHz的采样频率人耳已无法辨别出来了，所以并没有什么实用价值。
// 采样位数
// 采样位数可以用来描述连续变化的幅度值
// 一般情况下，采样位数是8或16，8位的可以划分为2^8=256份，范围是0-255。16位的可以划分位2^16=65536份，范围是-32768到32767。
// 到这就是量化了，采样位数这个数值越大，解析度就越高，录制和回放的声音就越真实。
// https://www.jb51.cc/res/2019/04-15/21/c825c72830920d124991d39c116b829b.png
// https://www.jb51.cc/res/2019/04-15/21/af05b897efb134aa015cee67dbcf0e36.png
