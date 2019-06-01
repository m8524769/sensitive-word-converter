import { Converter } from '../src';
import { expect } from 'chai';

interface TestSuite {
  name: string;
  testCases: TestCase[];
}

interface TestCase {
  name: string;
  args: string[];
  expect: string;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: '空值测试',
    testCases: [
      {
        name: '默认替换字符',
        args: [''],
        expect: ''
      },
      {
        name: '指定替换字符',
        args: ['', '_'],
        expect: ''
      },
    ]
  },
  {
    name: '西文敏感词测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['safe'],
        expect: 'safe'
      },
      {
        name: '单个敏感词',
        args: ['hello'],
        expect: '**llo'
      },
      {
        name: '多个敏感词（分离）',
        args: ['hello world'],
        expect: '**llo *****'
      },
      {
        name: '多个敏感词（相连）',
        args: ['hehello'],
        expect: '****llo'
      },
      {
        name: '完全匹配',
        args: ['world'],
        expect: '*****'
      },
      {
        name: '单字母敏感词',
        args: ['x'],
        expect: '*'
      },
      {
        name: '指定替换字符',
        args: ['hello', '_'],
        expect: '__llo'
      },
    ]
  },
  {
    name: '中文敏感词测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['你好啊'],
        expect: '你好啊'
      },
      {
        name: '单个敏感词',
        args: ['哈麻批'],
        expect: '*麻批'
      },
      {
        name: '多个敏感词（分离）',
        args: ['哈麻批呦哈麻批'],
        expect: '*麻批呦*麻批'
      },
      {
        name: '多个敏感词（相连）',
        args: ['哈哈哈哈哈麻批'],
        expect: '*****麻批'
      },
      {
        name: '完全匹配',
        args: ['你好骚啊'],
        expect: '****'
      },
      {
        name: '单汉字敏感词',
        args: ['哈'],
        expect: '*'
      },
      {
        name: '指定替换中文',
        args: ['哈哈哈哈啪！', '喵'],
        expect: '喵喵喵喵啪！'
      },
    ]
  },
  {
    name: '敏感数字测试',
    testCases: [
      {
        name: '无敏感数字',
        args: ['12345'],
        expect: '12345'
      },
      {
        name: '单个敏感数字',
        args: ['12345996'],
        expect: '12345***'
      },
      {
        name: '多个敏感数字（分离）',
        args: ['996345996'],
        expect: '***345***'
      },
      {
        name: '多个敏感数字（相连）',
        args: ['123996996'],
        expect: '123******'
      },
      {
        name: '完全匹配',
        args: ['996'],
        expect: '***'
      },
      {
        name: '指定替换字符',
        args: ['12345996', '_'],
        expect: '12345___'
      },
    ]
  },
  {
    name: '特殊符号测试',
    testCases: [
      {
        name: '无敏感词',
        args: ['( •̀ ω •́ )✧'],
        expect: '( •̀ ω •́ )✧'
      },
      {
        name: '有敏感词',
        args: ['ヾ(≧▽≦*)o'],
        expect: '********'
      },
      {
        name: '指定替换字符',
        args: ['ヾ(≧▽≦*)o', '_'],
        expect: '________'
      },
    ]
  },
  {
    name: '表情符号测试（单个表情长度为2）',
    testCases: [
      {
        name: '无敏感表情',
        args: ['🤣🤣🤣'],
        expect: '🤣🤣🤣'
      },
      {
        name: '有敏感表情',
        args: ['🙄🙄🙄'],
        expect: '******'
      },
      {
        name: '指定替换字符',
        args: ['🙄🙄🙄', '_'],
        expect: '______'
      },
      {
        name: '指定替换表情',
        args: ['🙄🙄', '🤣'],
        expect: '🤣🤣🤣🤣'
      },
    ]
  },
  {
    name: '敏感词位置测试',
    testCases: [
      {
        name: '位于字符串开头',
        args: ['heend'],
        expect: '**end'
      },
      {
        name: '位于字符串中部',
        args: ['frontheend'],
        expect: 'front**end'
      },
      {
        name: '位于字符串末尾',
        args: ['fronthe'],
        expect: 'front**'
      },
    ]
  },
  {
    name: '特殊情况',
    testCases: [
      {
        name: '包含默认替换字符',
        args: ['*****'],
        expect: '*****'
      },
      {
        name: '包含指定替换字符',
        args: ['_____', '_'],
        expect: '_____'
      },
      {
        name: '指定替换字符串长度大于1',
        args: ['hello', '***'],
        expect: '******llo'
      },
      {
        name: '指定替换字符为表情符号',
        args: ['world', '🤣'],
        expect: '🤣🤣🤣🤣🤣'
      },
      {
        name: '指定替换字符为空',
        args: ['hello', ''],
        expect: 'llo'
      },
    ]
  },
  {
    name: '长文综合测试',
    testCases: [
      {
        name: '综合测试 #1',
        args: ['Last week, Chinese tech giant Huawei was officially sanctioned by the United States. That effectively means U.S.-based companies are banned from doing any sort of business with the mobile phone giant moving forward. And this is just the beginning.After the U.S. sanctions were announced, Google revoked Huawei’s Android license, which could leave millions of smartphone owners stranded without updates. The process has since been temporarily suspended with the Department of Commerce granting Huawei a surprise 90-day permit to support existing customers — but the reprieve only covers existing products, and the window seems unlikely to be extended.Shortly after Google’s move, computer chipset maker Intel said it couldn’t sell laptop CPUs to Huawei, and a few days later, chip designer ARM announced it couldn’t sell the company smartphone CPUs — even though ARM is based in the U.K., which is technically beyond the reach of the embargo.If any of these things happened in isolation, Huawei might have been able to weather the storm until one side of the U.S.-China trade war backed down. The Shenzhen-based company certainly seemed to have been planning for a scenario just like this, laying in a “stockpile” of supplies ahead of the ban. But it’s hard to imagine the company lasting the year without falling apart, unless there’s rapid political resolution — resolution that seems increasingly unlikely.It’s entirely possible that Huawei might implode as a result of all of this — in a similar way to how rapidly the Chinese telecom company ZTE found itself near the brink of financial disaster in 2018, when it ended up on the same list. But no matter your stance on the company and the politics surrounding it, what happens next is likely to be bad for tech and the global economy. Huawei’s downfall might finally pop the bubble once and for all.'],
        expect: 'Last week, Chinese tech giant Huawei was officially sanctioned by t** United States. That effectively means U.S.-based companies are banned from doing any sort of business with t** mobile phone giant moving forward. And this is just t** beginning.After t** U.S. sanctions were announced, Google revoked Huawei’s Android license, which could leave millions of smartphone owners stranded without updates. T** process has since been temporarily suspended with t** Department of Commerce granting Huawei a surprise 90-day permit to support e*isting customers — but t** reprieve only covers e*isting products, and t** window seems unlikely to be e*tended.Shortly after Google’s move, computer chipset maker Intel said it couldn’t sell laptop CPUs to Huawei, and a few days later, chip designer ARM announced it couldn’t sell t** company smartphone CPUs — even though ARM is based in t** U.K., which is technically beyond t** reach of t** embargo.If any of t**se things happened in isolation, Huawei might have been able to weat**r t** storm until one side of t** U.S.-China trade war backed down. T** S**nz**n-based company certainly seemed to have been planning for a scenario just like this, laying in a “stockpile” of supplies a**ad of t** ban. But it’s hard to imagine t** company lasting t** year without falling apart, unless t**re’s rapid political resolution — resolution that seems increasingly unlikely.It’s entirely possible that Huawei might implode as a result of all of this — in a similar way to how rapidly t** Chinese telecom company ZTE found itself near t** brink of financial disaster in 2018, w**n it ended up on t** same list. But no matter your stance on t** company and t** politics surrounding it, what happens ne*t is likely to be bad for tech and t** global economy. Huawei’s downfall might finally pop t** bubble once and for all.'
      },
      {
        name: '综合测试 #2',
        args: ['从小学开始，辻村深月就立志成为一名作家，她的处女作也正是在那时诞生。在初中、高中时代，她持续地创作小说，并与班上的同学们分享。在得到了同学们的称赞后，辻村建立了信心，并萌生了成为职业作家的想法。《时间停止的冰封校舍》即是辻村从高中阶段开始创作的作品。上高中后，她明确了自己要向推理作家的方向发展，并在大学期间加入了推理小说研究社团。她阅读的书越来越多、越来越艰深，但却始终没有忘记自己从小就一直深爱的《哆啦A梦》——以至于，她将哆啦A梦写进了自己的书里。2005 年，她的长篇小说《冰冻鲸鱼》出版，被评论为“充满了对哆啦A梦的爱”。本书各章标题都以《哆啦A梦》中的秘密道具为名，任意门、如果电话亭、人体保险丝这些熟悉的名字让人仿佛置身于哆啦A梦的世界。更别提作品的主人公就是对《哆啦A梦》作者藤子·F·不二雄深感兴趣的高中生，故事中也出现了不少对《哆啦A梦》的引用和讨论。', '喵'],
        expect: '从小学开始，辻村深月就立志成为一名作家，她的处女作也正是在那时诞生。在初中、高中时代，她持续地创作小说，并与班上的同学们分享。在得到了同学们的称赞后，辻村建立了信心，并萌生了成为职业作家的想法。《时间停止的冰封校舍》即是辻村从高中阶段开始创作的作品。上高中后，她明确了自己要向推理作家的方向发展，并在大学期间加入了推理小说研究社团。她阅读的书越来越多、越来越艰深，但却始终没有忘记自己从小就一直深爱的《哆啦A梦》——以至于，她将哆啦A梦写进了自己的书里。2005 年，她的长篇小说《冰冻鲸鱼》出版，被评论为“充满了对哆啦A梦的爱”。本书各章标题都以《哆啦A梦》中的秘密道具为名，任意门、如果电话亭、人体保险丝这些熟悉的名字让人仿佛置身于哆啦A梦的世界。更别提作品的主人公就是对《哆啦A梦》作者藤子·F·不二雄深感兴趣的高中生，故事中也出现了不少对《哆啦A梦》的引用和讨论。'
      },
      {
        name: '综合测试 #3',
        args: ['早上9点到岗，晚上9点下班，每周工作6天，这就是所谓的996工作制。近日，996工作制火了，有程序员在世界级的代码仓库Github上建立项目，表达对996工作制的不满。短短几天内，该项目获得大量程序员的关注和支持。　　随后，互联网巨头纷纷对996工作制作出反应，一时间，996被推上了风口浪尖。　　马云先发声表示，996是福报。后再次针对996发表观点称，关键不是对不对，而是思考自己的选择。而刘强东则在朋友圈发文章称，“混日子的人不是我的兄弟。”而当当创始人李国庆则挑起了反对996的大旗，他认为，管理者提高决策科学性和效率比员工加班更有价值。　　一边是反对声占多数的员工，一边是大谈责任、事业的老板们，关于996，你怎么看？新京报记者采访了搜狐创始人张朝阳，互联网公司人力（HR）、法务，法律人士，人力资源专家，以及百度、阿里、京东等企业员工，共同讨论关于996的话题。'],
        expect: '早上9点到岗，晚上9点下班，每周工作6天，这就是所谓的***工作制。近日，***工作制火了，有程序员在世界级的代码仓库Github上建立项目，表达对***工作制的不满。短短几天内，该项目获得大量程序员的关注和支持。　　随后，互联网巨头纷纷对***工作制作出反应，一时间，***被推上了风口浪尖。　　马云先发声表示，***是福报。后再次针对***发表观点称，关键不是对不对，而是思考自己的选择。而刘强东则在朋友圈发文章称，“混日子的人不是我的兄弟。”而当当创始人李国庆则挑起了反对***的大旗，他认为，管理者提高决策科学性和效率比员工加班更有价值。　　一边是反对声占多数的员工，一边是大谈责任、事业的老板们，关于***，你怎么看？新京报记者采访了搜狐创始人张朝阳，互联网公司人力（HR）、法务，法律人士，人力资源专家，以及百度、阿里、京东等企业员工，共同讨论关于***的话题。'
      },
    ]
  },
];

describe('Converter', () => {

  let cvt: Converter;

  before(async () => {
    await new Converter(
      './sensitiveWords.txt',
      'https://raw.githubusercontent.com/fwwdn/sensitive-stop-words/master/%E5%B9%BF%E5%91%8A.txt'
    ).isReady.then(converter => {
      cvt = converter;
    });
  });

  describe('#convert()', () => {
    TEST_SUITES.forEach(testSuite => {
      describe(testSuite.name, () => {
        testSuite.testCases.forEach(testCase => {
          it(testCase.name, () => {
            expect(cvt.convert.apply(cvt, testCase.args))
              .to.equal(testCase.expect);
          });
        });
      });
    });
  });

});
