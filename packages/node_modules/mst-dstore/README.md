mst-dstore
==========

This is an (under construction, partially functional) [dstore](http://dstorejs.io/)-compatible
store backed by [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree).

Note: If a `dgrid` column has an `editor` with `autoSave`,
items in the state tree should have a `set` action which `dgrid` will call with a new snapshot.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/mst-dstore/master/LICENSE)

Copyright (c) 2017-2018 BusFaster Ltd
