### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

#### [v4.2.4](https://github.com/typed-code/schemats/compare/v4.2.3...v4.2.4)

#### [v4.2.3](https://github.com/typed-code/schemats/compare/v4.2.2...v4.2.3)

> 25 September 2020

- Bump deps [`98ed97b`](https://github.com/typed-code/schemats/commit/98ed97b901e34b5ad1a015a203b034b5fef33c3f)
- Add auto-changelog [`a239d75`](https://github.com/typed-code/schemats/commit/a239d7531eb7f7aa2d021313ac4034c3ac765c75)
- Bump v4.2.3 [`f4e012b`](https://github.com/typed-code/schemats/commit/f4e012be928b801ad7bcf7e0f836689d93dff00e)

#### [v4.2.2](https://github.com/typed-code/schemats/compare/v4.2.1...v4.2.2)

> 17 November 2019

- Handle mysql enum collisions [`#2`](https://github.com/typed-code/schemats/issues/2)
- Refactor generation of enums [`60dc15c`](https://github.com/typed-code/schemats/commit/60dc15c90ca120d9d5e93d9bfac9c0b1ffe57839)

#### [v4.2.1](https://github.com/typed-code/schemats/compare/v4.2.0...v4.2.1)

> 16 November 2019

- Improve performance, no querying table type separately [`929c419`](https://github.com/typed-code/schemats/commit/929c41914befa950e050c7f75dd7dde3ea455f7d)
- Refactor code [`3978b95`](https://github.com/typed-code/schemats/commit/3978b95e07a855981ac1c42dcc76e811342a76ae)
- Make Options as none default export [`d3d9077`](https://github.com/typed-code/schemats/commit/d3d9077f9eff295e5079df9c0a3a17d91b7ce792)

#### [v4.2.0](https://github.com/typed-code/schemats/compare/v4.1.2...v4.2.0)

> 15 November 2019

- feat: Change enum & set generation name in mysql [`e52c05a`](https://github.com/typed-code/schemats/commit/e52c05af4c1c2991de96b44686b365862529bb9f)

#### [v4.1.2](https://github.com/typed-code/schemats/compare/v4.1.1...v4.1.2)

> 15 November 2019

- bug-fix: generate enums only for specified tables (relevant only in MySQL). fixes #1 [`#1`](https://github.com/typed-code/schemats/issues/1)
- Fix deps [`e328fb8`](https://github.com/typed-code/schemats/commit/e328fb853cdbb45a74174976f2550ae9dc8fbb52)
- Refactor tests & string generation [`09ec367`](https://github.com/typed-code/schemats/commit/09ec367aaa2e7c9f8f83e224b815ad75b0d73c5c)
- Update tests [`d90eab4`](https://github.com/typed-code/schemats/commit/d90eab47abfd04b51bb3026eaf651d87cd3e37de)

#### [v4.1.1](https://github.com/typed-code/schemats/compare/v4.1.0...v4.1.1)

> 14 November 2019

- Sort mysql results by table_name / column_name [`e4dea35`](https://github.com/typed-code/schemats/commit/e4dea3579100080c5006b57d3190ac5568c643f7)
- Update npm published files [`b07207b`](https://github.com/typed-code/schemats/commit/b07207b4e4098579adfa7b7ceb41c8c50e2f3edd)
- Remove console.log again [`046405b`](https://github.com/typed-code/schemats/commit/046405b41a5ff14482572a622427e8f10e971429)

### [v4.1.0](https://github.com/typed-code/schemats/compare/v3.0.3...v4.1.0)

> 14 November 2019

- Progress with refactoring to jest [`19720ae`](https://github.com/typed-code/schemats/commit/19720aeb6a40f89928c58a2d81f9a52025891193)
- Start using tslint:latest & prettier [`d41275e`](https://github.com/typed-code/schemats/commit/d41275ed18026ecb48068988bcc22fcb681d9053)
- Bump deps [`44c85c5`](https://github.com/typed-code/schemats/commit/44c85c5d4391f702559e0387ecfca6ac40a32161)

#### [v3.0.3](https://github.com/typed-code/schemats/compare/v3.0.2...v3.0.3)

> 14 February 2018

- Fix for new ts.formatting.RulesProvider error [`#82`](https://github.com/typed-code/schemats/pull/82)
- Fix `Schemats failed to generate the database schema TypeError: ts.formatting.RulesProvider is not a constructor` errors probably coming from the new typescript release [`77cc398`](https://github.com/typed-code/schemats/commit/77cc39863734beb6686a4936f7f74fa3b38e13cd)
- Remove unused camelCase [`d3b515a`](https://github.com/typed-code/schemats/commit/d3b515ac54853c745e4cdddcc5e5276b2fcae2b5)

#### [v3.0.2](https://github.com/typed-code/schemats/compare/v3.0.1...v3.0.2)

> 5 January 2018

- 3.0.2 [`#78`](https://github.com/typed-code/schemats/pull/78)
- Add --noHeader switch [`#76`](https://github.com/typed-code/schemats/pull/76)
- Cast CITEXT type to string [`#75`](https://github.com/typed-code/schemats/pull/75)
- copied tests for citext [`eb5c5f5`](https://github.com/typed-code/schemats/commit/eb5c5f5d0849bed5b7deb212209b830c0809edb7)
- added citext array support [`29f3ab3`](https://github.com/typed-code/schemats/commit/29f3ab32e9d953027483f5fd9bb534adf04ce448)
- cast citext as string [`a521a23`](https://github.com/typed-code/schemats/commit/a521a23ca44878a49bbd810fe33c597f8f330804)

#### [v3.0.1](https://github.com/typed-code/schemats/compare/v3.0.0-beta.1...v3.0.1)

> 21 September 2017

- Type addition for postgres name, _json, _jsonb, and _timestamptz [`#74`](https://github.com/typed-code/schemats/pull/74)
- version 3.0.1 [`4d4cddf`](https://github.com/typed-code/schemats/commit/4d4cddf54195e74d3366d5bea74a908fa7469013)

#### [v3.0.0-beta.1](https://github.com/typed-code/schemats/compare/v3.0.0-beta.0...v3.0.0-beta.1)

> 14 August 2017

- main api interface accept db as a string type [`e5e0ef8`](https://github.com/typed-code/schemats/commit/e5e0ef8869cfed5f1b99a8007841f159a46bdc65)
- prepare release v3.0.0-beta.1 [`066cf73`](https://github.com/typed-code/schemats/commit/066cf73f5177315372f21852d75058e5acefc15e)

#### [v3.0.0-beta.0](https://github.com/typed-code/schemats/compare/v2.4.0...v3.0.0-beta.0)

> 14 August 2017

- Refactor main entrypoint [`#72`](https://github.com/typed-code/schemats/pull/72)
- support strict typing from pg-promise. [`#71`](https://github.com/typed-code/schemats/pull/71)
- Refactor db specific default schema [`#70`](https://github.com/typed-code/schemats/pull/70)
- Remove the option of generating namespace which has been deprecated in v2.0.0 [`#69`](https://github.com/typed-code/schemats/pull/69)
- Fix getting options [`a4c51f9`](https://github.com/typed-code/schemats/commit/a4c51f9a0fa190e4f5710ff696c8b137e1708f10)
- Add library version in the headers generated [`3b2b9bc`](https://github.com/typed-code/schemats/commit/3b2b9bc57ff12f6a1541f3ae0894abbe4f94be08)
- minor [`f52e6dd`](https://github.com/typed-code/schemats/commit/f52e6dd5d8b0c914e0f6e4f6a760e10eb54c15b3)

#### [v2.4.0](https://github.com/typed-code/schemats/compare/v2.3.0...v2.4.0)

> 22 July 2017

- Fix coveralls reporting [`#68`](https://github.com/typed-code/schemats/pull/68)
- Add --camelCase/-C option [`#67`](https://github.com/typed-code/schemats/pull/67)
- Bump typescript and pg-promise version [`#65`](https://github.com/typed-code/schemats/pull/65)
- Create CODE_OF_CONDUCT.md [`546c89f`](https://github.com/typed-code/schemats/commit/546c89f0288f1a905417dc778eef4dd1cab62d11)
- Update README.md [`f3ff51a`](https://github.com/typed-code/schemats/commit/f3ff51a7bd119fb66bccad195c16ab0b774d1c23)
- Create CONTRIBUTING.md [`f139717`](https://github.com/typed-code/schemats/commit/f1397177dbfed8ab09df573611f4b5cbaaa4d92d)

#### [v2.3.0](https://github.com/typed-code/schemats/compare/v2.2.0...v2.3.0)

> 23 June 2017

- Allow specifying arguments as environment variables [`#64`](https://github.com/typed-code/schemats/pull/64)
- Upgrade dependencies [`#62`](https://github.com/typed-code/schemats/pull/62)
- Upgrade to tslint 5 [`6547c41`](https://github.com/typed-code/schemats/commit/6547c4171fac194872e4a6b3cef9d5e9fbfda46f)
- Update package.json [`e824865`](https://github.com/typed-code/schemats/commit/e824865bee5b583b05998c34451e2e05d4ccd997)
- upgrade dependencies [`070c1ff`](https://github.com/typed-code/schemats/commit/070c1fff775b5d542296f7fa9b281d2c488d1ab7)

#### [v2.2.0](https://github.com/typed-code/schemats/compare/v2.1.1...v2.2.0)

> 4 June 2017

- disable tslint & normalize table names [`#60`](https://github.com/typed-code/schemats/pull/60)
- Use Travis CI [`#59`](https://github.com/typed-code/schemats/pull/59)
- Better istanbul test coverage analysis with typescript and mocha [`#58`](https://github.com/typed-code/schemats/pull/58)
- disable tslint, add package to keywords, normalized table name [`c9a41f6`](https://github.com/typed-code/schemats/commit/c9a41f634654b9b76f7f45fee8133abfad5808b6)
- added namespace normalize integration test [`ec3a606`](https://github.com/typed-code/schemats/commit/ec3a6068831bbce89ff12f80ece6c3efa382fa84)

#### [v2.1.1](https://github.com/typed-code/schemats/compare/v2.1.0...v2.1.1)

> 28 April 2017

- cli test [`6498a61`](https://github.com/typed-code/schemats/commit/6498a61fdd08e5509005ecd11edc68477945d5ba)
- update to yargs@7 to resolve an issue with argument parsing [`5160ae2`](https://github.com/typed-code/schemats/commit/5160ae2105d49e2ca467ff24c42ba43c0f88a593)

#### [v2.1.0](https://github.com/typed-code/schemats/compare/v2.0.0...v2.1.0)

> 24 April 2017

- Test refactor [`#54`](https://github.com/typed-code/schemats/pull/54)
- Support loading config from schemats.json [#49] [`#53`](https://github.com/typed-code/schemats/pull/53)
- pulled test setup out of integration tests, moved tests into separate file, added static methods to classes, added unit tests for mysql db [`6acdfc2`](https://github.com/typed-code/schemats/commit/6acdfc20e2471fcb68772f493e1ed3d4a41a89d1)
- added postgres db tests [`6f77a2b`](https://github.com/typed-code/schemats/commit/6f77a2b528e6064dc1c9fce8392785dd70301d17)
- split tests into integration and unit tests, added mocha opts, moved test utilities out of test file, restructured fixtures, added db cleanup init scripts [`0941d19`](https://github.com/typed-code/schemats/commit/0941d19bfded851c0b119008595fcb1c21548810)

### [v2.0.0](https://github.com/typed-code/schemats/compare/v1.2.0...v2.0.0)

> 20 April 2017

- Added mysql support [`#52`](https://github.com/typed-code/schemats/pull/52)
- added mysql support [`b46fae7`](https://github.com/typed-code/schemats/commit/b46fae7c2ff170c3e82443aa0b2f3c1fa47c74c3)
- added mysql tests [`c6b4901`](https://github.com/typed-code/schemats/commit/c6b49011b25b406dce6ccf621ae68b6761beb424)
- used mysql js type mappings where sensible [`baf93be`](https://github.com/typed-code/schemats/commit/baf93be2c71b0499d994bd273633fd6468a359d9)

#### [v1.2.0](https://github.com/typed-code/schemats/compare/v1.1.5...v1.2.0)

> 25 February 2017

- Add end user usecase test. Use TS 2.1 index access type [`#48`](https://github.com/typed-code/schemats/pull/48)

#### [v1.1.5](https://github.com/typed-code/schemats/compare/v1.1.4...v1.1.5)

> 20 February 2017

- Update README.md [`#45`](https://github.com/typed-code/schemats/pull/45)

#### [v1.1.4](https://github.com/typed-code/schemats/compare/v1.1.3...v1.1.4)

> 16 February 2017

- Update schema.ts [`#44`](https://github.com/typed-code/schemats/pull/44)
- [tslint] less strict alignment [`13ed3d9`](https://github.com/typed-code/schemats/commit/13ed3d9d63a670f9f33e473c5d1662cb8d8e2856)

#### [v1.1.3](https://github.com/typed-code/schemats/compare/v1.1.2...v1.1.3)

> 15 February 2017

- Update README [`#43`](https://github.com/typed-code/schemats/pull/43)
- Better structure for testing, also uses mocha [`#41`](https://github.com/typed-code/schemats/pull/41)
- Better structure for testing, also uses mocha. [`b6b7a95`](https://github.com/typed-code/schemats/commit/b6b7a95748cd8039555b2fd87b02207c813d3100)

#### [v1.1.2](https://github.com/typed-code/schemats/compare/v1.1.1...v1.1.2)

> 10 February 2017

- Use upstream typescript-formatter@4.1.1 [`#42`](https://github.com/typed-code/schemats/pull/42)

#### [v1.1.1](https://github.com/typed-code/schemats/compare/v1.0.2...v1.1.1)

> 8 February 2017

- hotfix for #37 [`#40`](https://github.com/typed-code/schemats/pull/40)
- Add test coverage, coveralls integration and more test cases [`#39`](https://github.com/typed-code/schemats/pull/39)
- use writeFileSync for output [`#38`](https://github.com/typed-code/schemats/pull/38)
- move gettime to bin [`fe88b57`](https://github.com/typed-code/schemats/commit/fe88b57e57a12d36e6f6fb5eb5dfc1df23f40449)
- Added istanbul for test coverage [`f11d0b1`](https://github.com/typed-code/schemats/commit/f11d0b193cce2889bcaeddc2c8a9491a8defd58b)
- Improve test coverage [`9186d8b`](https://github.com/typed-code/schemats/commit/9186d8b50e321504636c8b87412b3dca2187265b)

#### [v1.0.2](https://github.com/typed-code/schemats/compare/v1.0.1...v1.0.2)

> 24 January 2017

- Pass namespace as null for tests, and allow null in typescriptOfSchema, fix #35 [`#36`](https://github.com/typed-code/schemats/pull/36)
- Merge pull request #36 from abenhamdine/master [`#35`](https://github.com/typed-code/schemats/issues/35)
- Pass namespace as null, and allow null in typescriptOfSchema [`9d6aba6`](https://github.com/typed-code/schemats/commit/9d6aba64569bff44bbcfa86534859c1749d9224d)

#### [v1.0.1](https://github.com/typed-code/schemats/compare/v1.0.0...v1.0.1)

> 16 January 2017

- v1.0 [`#34`](https://github.com/typed-code/schemats/pull/34)
- update demo gif url [`e321db6`](https://github.com/typed-code/schemats/commit/e321db6ebeff4010a9bd9689d042c07320bfcc14)

### [v1.0.0](https://github.com/typed-code/schemats/compare/v0.7.0...v1.0.0)

> 16 January 2017

- Add support for nullable types, map any as default type : fix #19, fix #31 [`#33`](https://github.com/typed-code/schemats/pull/33)
- Merge pull request #33 from abenhamdine/master [`#19`](https://github.com/typed-code/schemats/issues/19) [`#31`](https://github.com/typed-code/schemats/issues/31)
- Fix #19, fix #31 [`#19`](https://github.com/typed-code/schemats/issues/19) [`#31`](https://github.com/typed-code/schemats/issues/31)
- Implements generation without namespace [`e3b0881`](https://github.com/typed-code/schemats/commit/e3b0881592befb76add42113b74006e73a48682b)
- Update README to document steps to upgrade to v1.0 [`54b25d7`](https://github.com/typed-code/schemats/commit/54b25d74969ac4a5114651d6b81f087b2f9335e3)
- Documenting the testing process [`36e973a`](https://github.com/typed-code/schemats/commit/36e973a81f343d9982a3dc172d1508a9457456c2)

#### [v0.7.0](https://github.com/typed-code/schemats/compare/v0.6.1...v0.7.0)

> 12 January 2017

- Support Enum Type [`#30`](https://github.com/typed-code/schemats/pull/30)
- Add more datatypes [`#28`](https://github.com/typed-code/schemats/pull/28)
- Fix SQL query for proper table selection [`f3cbc36`](https://github.com/typed-code/schemats/commit/f3cbc36e7130846f797753c9bc8f76ffdacfd304)
- Less strict diff in testing [`4d0134a`](https://github.com/typed-code/schemats/commit/4d0134ae8f79e939f4d76cae8f7311cf2fa42a54)

#### [v0.6.1](https://github.com/typed-code/schemats/compare/v0.6.0...v0.6.1)

> 6 January 2017

- keep test/artifacts directory [`#27`](https://github.com/typed-code/schemats/pull/27)
- Explain how to generate tables for a whole pg schema [`#26`](https://github.com/typed-code/schemats/pull/26)
- Minor rewording [`bc88b00`](https://github.com/typed-code/schemats/commit/bc88b00625dccb993eacfde9bf974f0826c0eb9f)

#### [v0.6.0](https://github.com/typed-code/schemats/compare/v0.5.2...v0.6.0)

> 5 January 2017

- Add new types, fix #20 [`#21`](https://github.com/typed-code/schemats/pull/21)
- Merge pull request #21 from abenhamdine/add-new-types [`#20`](https://github.com/typed-code/schemats/issues/20)
- Add new common types [`de17e72`](https://github.com/typed-code/schemats/commit/de17e724d36ca56ca3acbe5a018c2306589b823a)

#### [v0.5.2](https://github.com/typed-code/schemats/compare/v0.5.1...v0.5.2)

> 23 December 2016

- upgrade tslint [`3a096ce`](https://github.com/typed-code/schemats/commit/3a096ce7adeec40a887d9e764bf40863808789fc)
- npm package only d.ts and js files [`b625ae5`](https://github.com/typed-code/schemats/commit/b625ae5885f2815bf793543ca24c3b25bce8ea40)
- typo [`975489b`](https://github.com/typed-code/schemats/commit/975489b6ce475e181d092aa3df8cd2ed43d5f46b)

#### [v0.5.1](https://github.com/typed-code/schemats/compare/v0.5.0...v0.5.1)

> 23 December 2016

- Stricter type checking [`96c396b`](https://github.com/typed-code/schemats/commit/96c396b132daf47d91e046ab70d53c29dc879a7c)
- output d.ts files [`657be55`](https://github.com/typed-code/schemats/commit/657be5534588498aceb9dd5a485a8d3f2a0316a9)
- move test output to artifacts folder [`c1afa45`](https://github.com/typed-code/schemats/commit/c1afa45e263ddfd892f1a3ec9b298da2882c5e14)

#### [v0.5.0](https://github.com/typed-code/schemats/compare/v0.4.0...v0.5.0)

> 23 December 2016

- Schema support [`#14`](https://github.com/typed-code/schemats/pull/14)
- Add test. [`cc2a261`](https://github.com/typed-code/schemats/commit/cc2a2613add3dfc3806c34b9321e15221c22b999)
- Schema support. [`57a5ec0`](https://github.com/typed-code/schemats/commit/57a5ec0d0be026bd1fded298faaac464cd2f682a)
- lint [`6c115a9`](https://github.com/typed-code/schemats/commit/6c115a9be02a1bc8994352659159ff0f48a7f489)

#### [v0.4.0](https://github.com/typed-code/schemats/compare/0.3.1...v0.4.0)

> 22 December 2016

- normalize column name [`97433d9`](https://github.com/typed-code/schemats/commit/97433d981cc01fb248bbc29476cd960f20b059cb)
- Fix output ts formatting issue [`3212e0d`](https://github.com/typed-code/schemats/commit/3212e0dc16d1cb7e47a2e3d6d227ad37fa72c641)
- add test cases [`85887f7`](https://github.com/typed-code/schemats/commit/85887f7b4784c5eaab971a0e10d02316e6c8d375)

#### [0.3.1](https://github.com/typed-code/schemats/compare/0.3.0...0.3.1)

> 22 December 2016

- Add support for uuid columns [`#18`](https://github.com/typed-code/schemats/pull/18)
- prepare release 0.3.1 [`08a08fd`](https://github.com/typed-code/schemats/commit/08a08fdc06811d4e8e72044c7dc47b4ddc9cb099)
- Some spaces missing in test file [`4f76c66`](https://github.com/typed-code/schemats/commit/4f76c66d5aad7e4896aaeb7c0d13a71a7f645b28)
- Add correct test file [`827e779`](https://github.com/typed-code/schemats/commit/827e7799cb00c30dfdc873570adee282718b25a9)

#### [0.3.0](https://github.com/typed-code/schemats/compare/0.2.2...0.3.0)

> 7 December 2016

- Minor linting and fixing ci build error [`#13`](https://github.com/typed-code/schemats/pull/13)
- Add do-not-edit header comments to generated ts files. [`#11`](https://github.com/typed-code/schemats/pull/11)
- Include DO NOT EDIT comment. [`190b952`](https://github.com/typed-code/schemats/commit/190b952067bd53453fef44e62ad3950067be8ae4)
- Extract 'extractCommand' to own function. [`26ce1cd`](https://github.com/typed-code/schemats/commit/26ce1cdcb169f79d61bee6e0d27198744b0c9853)
- Add time generated. [`47d2070`](https://github.com/typed-code/schemats/commit/47d2070e0e8f27a27752551e842159d51c5b0366)

#### [0.2.2](https://github.com/typed-code/schemats/compare/0.2.1...0.2.2)

> 29 November 2016

- Update README.md [`6ead1dc`](https://github.com/typed-code/schemats/commit/6ead1dc9cfe757bd0c41f1eca80de578c912f7d7)
- prepare release 0.2.2 [`1e03e9a`](https://github.com/typed-code/schemats/commit/1e03e9ad7a96038e2e7cf840d3fa68f82a80fa2e)

#### [0.2.1](https://github.com/typed-code/schemats/compare/0.2.0...0.2.1)

> 29 November 2016

- Fixed example. [`#8`](https://github.com/typed-code/schemats/pull/8)
- Use LF for newline in tsconfig, fix #7 [`#7`](https://github.com/typed-code/schemats/issues/7)
- prepare release 0.2.1 [`7c75d7f`](https://github.com/typed-code/schemats/commit/7c75d7fd35d4c53221a1bc83c2d41b5b940ce490)

#### [0.2.0](https://github.com/typed-code/schemats/compare/0.1.12...0.2.0)

> 20 November 2016

- vscode, use typescript in workspace [`f73a078`](https://github.com/typed-code/schemats/commit/f73a07826851e5492037b19f011e6c0e80d7f31f)
- prepare release 0.2.0 [`b07d6e2`](https://github.com/typed-code/schemats/commit/b07d6e2a90a36542e9e39c413cab0b4445b10f58)
- Use upstream pg-promise [`9c544e4`](https://github.com/typed-code/schemats/commit/9c544e4ee94a0de5fadea0185f7c8fffdc7c80c7)

#### [0.1.12](https://github.com/typed-code/schemats/compare/0.1.11...0.1.12)

> 18 November 2016

- Typo in "typescript" [`#5`](https://github.com/typed-code/schemats/pull/5)
- prepare release 0.1.12 [`feacf6a`](https://github.com/typed-code/schemats/commit/feacf6aae0688e61396e15ab52c5bef18480dea0)
- fix typo [`b0633b7`](https://github.com/typed-code/schemats/commit/b0633b795a1708543cb5658078acab41054c4dac)

#### [0.1.11](https://github.com/typed-code/schemats/compare/0.1.10...0.1.11)

> 16 November 2016

- prepare release 0.1.11 [`ad00f2c`](https://github.com/typed-code/schemats/commit/ad00f2cd36c37999934d459ed4903950d85db5b1)
- update pg-promise [`abe30cd`](https://github.com/typed-code/schemats/commit/abe30cdb75330988727ab3f80a9c48faa7d4ba70)

#### [0.1.10](https://github.com/typed-code/schemats/compare/0.1.8...0.1.10)

> 16 November 2016

- Update schema.ts simplifying the code. [`#4`](https://github.com/typed-code/schemats/pull/4)
- Update schema.ts [`01bf779`](https://github.com/typed-code/schemats/commit/01bf779e68c85d9fe8d8adbc8d532f2e1ff7e53a)
- lint package.json [`ab56e0e`](https://github.com/typed-code/schemats/commit/ab56e0ec1e2a23672c53974c8fab27cb9aaa84d2)
- contributing section [`46fc13d`](https://github.com/typed-code/schemats/commit/46fc13dbbb40da6212793327582f0d74c200c094)

#### [0.1.8](https://github.com/typed-code/schemats/compare/0.1.7...0.1.8)

> 11 November 2016

- npm ignore demo gifs [`e07b4ff`](https://github.com/typed-code/schemats/commit/e07b4ffaaf5a805f5fcb3e83975c8a0d1c3e0a4c)

#### [0.1.7](https://github.com/typed-code/schemats/compare/0.1.6...0.1.7)

> 11 November 2016

- update badges [`6dc13d2`](https://github.com/typed-code/schemats/commit/6dc13d2d7d71b9c6b43d2e3c05b87ef6c118e4cc)

#### [0.1.6](https://github.com/typed-code/schemats/compare/0.1.5...0.1.6)

> 11 November 2016

- fix npm dependencies [`b965094`](https://github.com/typed-code/schemats/commit/b965094ea5e132f738ba50cf0e2375211dd6e9ec)

#### [0.1.5](https://github.com/typed-code/schemats/compare/v0.1.0...0.1.5)

> 11 November 2016

- Initial Commit [`0aac9d4`](https://github.com/typed-code/schemats/commit/0aac9d46a1ceab54400066659651485750785fd7)
- 0.1.5 release [`5177314`](https://github.com/typed-code/schemats/commit/51773144cdea6ede1a858f1dfd4a7f1365936a32)

#### v0.1.0

> 29 August 2016

- Initial Commit [`ba0d6fe`](https://github.com/typed-code/schemats/commit/ba0d6fe0c789ec325c52c66b6dbd68e8d2afb0c2)
- README and example [`c09425f`](https://github.com/typed-code/schemats/commit/c09425fef71657a6e8acd65665bab790d166e71e)
- npm bin and install script [`762c349`](https://github.com/typed-code/schemats/commit/762c3492a29f9299630c2677605a110c0b820880)