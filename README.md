# aquestalk-player-mac

## description
AquesTalk javascript audio play, and record library for Mac.

[aquestalk-mac](https://github.com/taku-o/aquestalk-mac)のサンプルライブラリと、サンプルアプリです。
AquesTalkベースで作成した音声を再生したり、録音したりできます。

## サンプルアプリの利用
### npm install

```sh
npm install
./node_modules/.bin/electron-rebuild
```

### AquesTalkライブラリ
* AquesTalk2、AqKanji2Koeの評価版ライブラリを、"vendorEva"ディレクトリに置きます。

```
|-- vendorEva
    |-- AqKanji2Koe.framework
    |-- AquesTalk2Eva.framework
    |-- aq_dic_large/aq_user.dic
    |-- aq_dic_large/aqdic.bin
    `-- phont/aq_f1c.phont
```

### run
* Elelectronアプリを起動します。

```sh
cd sample
npm run start
```

