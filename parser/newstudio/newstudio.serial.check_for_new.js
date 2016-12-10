const NSSerialParser = require('./newstudio.serial.parser');
const SerialDbManager = require('../serial/serial.db.manager');
const fs = require('fs');

var sampleSerials = [
    { rus_name: '10 причин моей ненависти',
        url: 'http://newstudio.tv/viewforum.php?f=178',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=6703',
        orig_name: '10 Things I Hate About You',
        start_year: 2009,
        genres: [ 'комедия' ],
        directors: 'Джил Джангер',
        actors: 'Линдси Шоу / Lindsey Shaw, Миган Йетте Мартин / Meaghan Jette Martin, Ларри Миллер / Larry Miller, Этан Пек / Ethan Peck, Николас Браун / Nicholas Braun, Кайл Каплан / Kyle Kaplan, Дэна Дэвис / Dana Davis, Крис Зилка / Chris Zylka, Джолин Парди / Jolene Purdy',
        description: 'Сестры Стрэтфорд — новенькие в школе Падуи. Бианка — легкомысленная блондинка, а ее сестра Кэт — убежденная феминистка. Девчонки понимают, что им будет не так-то легко приспособится к новым порядкам, которые установила противная школьная болельщица Честити. Все вообще выходит из-под контроля, когда на горизонте появляется хулиган Патрик.' },
    { rus_name: '100 (Сотня)',
        url: 'http://newstudio.tv/viewforum.php?f=340',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=19197',
        orig_name: 'The 100',
        start_year: 2014,
        genres: [ 'фантастика' ],
        directors: 'Дин Уайт',
        actors: 'Элиза Тейлор-Коттер, Мари Авгеропулос, Сачин Сахель, Линдси Морган, Женевьев Бюкнер, Ричард Хэрмон',
        description: 'События в сериале начинают разворачиваться по прошествии девяносто семи лет после того как всю цивилизацию уничтожила страшная атомная война.Высоко в космосе на орбите Земли летает большой космический корабль, именно здесь находятся те, кто выжил после страшной катастрофы. Они единственные кто пережил этот ужасный катаклизм который устроило человечество. Именно с этого последнего пристанища людей на Землю отправляют космический челнок на котором находятся сто малолетних преступников…' },
    { rus_name: '100 Вопросов',
        url: 'http://newstudio.tv/viewforum.php?f=132',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=6704',
        orig_name: '100 Questions',
        start_year: 2010,
        genres: [ 'многокамерная комедия' ],
        directors: 'Кристофер Мойнихэн',
        actors: 'Софи Уинклман, Дэвид Уолтон, Смит Чо, Кристофер Мойнихэн, Коллетт Вульф, Майкл Бенджамин Вашингтон',
        description: 'Новая комедия от сценариста Кристофера Мойнихэна ответит на 100 вопросов о любви. Шарлотта Пейн ищет настоящую любовь и уже отвергла несколько предложений руки и сердца – ведь она должна встретить свою половинку. Когда она регистрируется на популярном сайте знакомств, она обращается за помощью к Рави, консультанту по вопросам отношений. Он заставляет ее ответить на 100 вопросов, чтобы выяснить, кто ей больше подойдет. На вопросы не так-то просто отвечать – каждый раз Шарлотте приходится вспомнить событие из своей жизни, или из жизни своих друзей Лесли (Элизабет Хоу), Джилл, Майка и Уейна. Эти вопросы открывают Шарлотте саму себя, и она начинает понимать, чего ищет в отношениях.' },
    { rus_name: '11.22.63',
        url: 'http://newstudio.tv/viewforum.php?f=452',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=18567',
        orig_name: '11.22.63',
        start_year: 2016,
        genres: [ 'фантастика', 'триллер', 'детектив' ],
        directors: 'Джеймс Стронг, Фред Туа, Джеймс Кент',
        actors: 'Джеймс Франко, Крис Купер, Джош Дюамель, Люси Фрай, Сара Гадон, Черри Джонс, Т.Р. Найт, Джордж МакКэй, Даниэль Уэббер',
        description: 'Фантастический фильм по роману Стивена Кинга «11/22/63». Джейк Эппинг – учитель английского языка в средней школе. Один из его учеников пишет эссе о том, что случилось 50 лет назад. Отец одного мальчика пришел домой пьяным и забил молотком свою жену, двух сыновей и дочь. Мальчик остался жив, но с тех пор хромает. Друг Джейка предлагает ему отправиться в 1958 год и предотвратить убийство президента Джона Кеннеди. Джейк не только спасает семью того мальчика, но и выслеживает убийцу Кеннеди.' },
    { rus_name: '24 часа: Проживи еще один день',
        url: 'http://newstudio.tv/viewforum.php?f=350',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=11554',
        orig_name: '24: Live Another Day',
        start_year: 2014,
        genres: [ 'боевик', 'триллер', 'драма', 'детектив' ],
        directors: 'Джон Кассар',
        actors: 'Кифер Сазерленд, Гбенга Акиннагбе, Бенджамин Брэтт, Уильям Дивэйн, Тейт Донован',
        description: 'Прошло 4 года после событий восьмого дня оригинального сериала «24 часа». Действия разворачиваются в Лондоне, где готовится страшный теракт. Джек находится в бегах, его преследует ЦРУ, старые друзья теперь не на его стороне, но он готов пойти на все ради предотвращения теракта, который может изменить мир навсегда…' },
    { rus_name: '666 парк авеню',
        url: 'http://newstudio.tv/viewforum.php?f=257',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=7567',
        orig_name: '666 Park Avenue',
        start_year: 2013,
        genres: [ 'ужасы', 'фантастика', 'драма' ],
        directors: 'Алекс Грейвз, Роберт Данкан МакНил',
        actors: 'Рэйчел Тейлор, Дэйв Эннэйбл, Терри О’Куинн, Мерседес Масун, Хелена Мэттссон, Ванесса Уильямс',
        description: 'Молодая семейная пара переезжает со среднего Запада в центр Нью-Йорка. Взявшись за работу управляющих престижного жилого здания в лучшем районе города, супруги намерены наладить жизнь и осуществить американскую мечту. На пути к поставленной цели присутствует небольшая проблема. Дело в том, что многие жильцы управляемого ими здания продали душу дьяволу, который охотно исполняет все их самые сокровенные желания…' },
    { rus_name: '90210',
        url: 'http://newstudio.tv/viewforum.php?f=109',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=1890',
        orig_name: '90210',
        start_year: 2008,
        genres: [ 'драма' ],
        directors: 'Mark Piznarski',
        actors: 'Шенайя Граймс, Тристан Уайлдз, Роб Эстас, Лорри Лафлин, Джессика Уолтер, Анналинн МакКорд, Дастин Миллиган, Майкл Стэгер, Джессика Строуп, Райан Эгголд и др.',
        description: 'Переехав в Беверли-Хиллз, Энни Уилсон и её брат Диксон вскоре понимают, что они уже не в Канзасе, и их жизнь никогда не будет прежней. Их родители — Гарри и Дебби — переехали в Калифорнию, чтобы заботиться о матери Гарри, бывшей телевизионной звезде с трудным характером Табите.Но перемены — не самое страшное в жизни ребят. Гарри назначили директором школы, в которой они должны учиться! События в школе — совсем другой разговор: добрая и ласковая Энни должна привыкнуть к царящим в школе законам джунглей, а её сводный брат Диксон к тому, что не обязательно здесь он станет звездой-спортсменом!Кстати, в этой школе учатся весьма необычные ребята: испорченная девчонка Наоми; спортсмен Итан; редактор школьных новостей Навид; бунтарка Сильвер, продюсирующая и снимающаяся в главной роли в своём интернет-сериале. Преподавательский состав то же интригует — Райан Меттьюз и социальный работник Келли Тейлор пытаются облегчить жизнь ребят в новой враждебной атмосфере.' },
    { rus_name: 'Halo: Сумерки',
        url: 'http://newstudio.tv/viewforum.php?f=375',
        source: 'newstudio',
        topic_url: 'http://newstudio.tv/viewtopic.php?t=12770',
        orig_name: 'Halo: Nightfall',
        start_year: 2014,
        genres: [ 'фантастика', 'боевик', 'триллер', 'приключения' ],
        directors: null,
        actors: 'Алексис Родни, Александр Бхат, Сара Армстронг, Александра Бхат, Шон Блэйни, Шейнин Бреннан',
        description: 'Действие сериала начнётся с событий на одной из Внешних колоний человечества, Седре. Отряд Службы военной разведки под командованием капитан-лейтенанта Джеймсона Локка высажен на планету с целью расследовать предполагаемую террористическую деятельность. Отряд подвергается атаке радикалов, и становится известно, что те пытаются использовать некое биологическое оружие, способное влиять только на людей. Ради своего выживания оперативники отряда вынуждены работать вместе с одним из местных командиров Рэндаллом Аикеном. Оставаясь на Седре, отряд обнаруживает инопланетный артефакт. Тем временем на орбиту колонии прибывает частично функциональная секция уничтоженной Установки 04.' },
];

exports.checkForNewSerials = function () {
    let all_serials;
    /*.then(serials => {
     fs.writeFile('data.json', JSON.stringify(serials,null,3), (err) => {
     if (err)
     console.error(err);
     console.log('saved');
     });
     });*/
    /*function readData(){
     return new Promise((resolve, reject) => {
     fs.readFile('data.json', (err, data) => {
     if (err)
     reject(err);
     resolve(JSON.parse(data));
     })
     })
     }
     readData()*/

    NSSerialParser.parseSerialNamesFromIndexPage()
        .then(serials => NSSerialParser.getSerialsOriginalNames(serials))
        .then(serials => serials.filter(serial => serial.orig_name && serial.start_year && serial.genres && serial.active_translation))
        .then(serials => {
            all_serials = serials;
            return serials;
        })
        .then(serials => serials.map(serial => SerialDbManager.checkForSerialExistanceInDB(serial)))
        .then(serials => Promise.all(serials))
        .then(serials_bool => serials_bool.map((val, index) => {
            return {
                exists: val,
                serial: all_serials[index]
            }
        }))
        .then(serials => serials.filter(serial => !serial.exists))
        .then(serials => serials.map(serial => serial.serial))
        .then(serials => NSSerialParser.getOMDBData(serials))
        .then(serials => NSSerialParser.filterOMDBData(serials))
        .then(serials => serials.map(serial => NSSerialParser.fillObjectToSuitModel(serial)))
        .then(serials => Promise.all(serials))
        .then(serials => serials.map(serial => SerialDbManager.addNewSerialToDB(serial)))
        .then(serials => Promise.all(serials))
        .then(serials => console.log(`[NSParser]: ${serials.length} new serials added.`));
};

exports.checkForNewSerials();