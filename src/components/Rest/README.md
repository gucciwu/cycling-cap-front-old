[b296c1dd]: http://www.mybatis.org/generator/index.html "Mybatis generator"
[048238ad]: https://docs.spring.io/spring-data/rest/docs/current/reference/html/ "Spring Data Rest"
[eb75fda9]: https://docs.spring.io/spring-data/rest/docs/current/reference/html/#customizing-sdr "Spring Data REST Configuration"

# 与Jess结合快速实现基于REST的CRUD
-----
Jeff和Jess结合实现数据字典的增删改查操作

# 1 流程图
![Flowchart](src/components/REST/doc/flowchart.png)
# 2 数据库
```
CREATE TABLE `dictionary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dict_entry` varchar(100) NOT NULL,
  `dict_key` varchar(100) NOT NULL,
  `dict_value` varchar(100) NOT NULL,
  `dict_remark` varchar(500) DEFAULT NULL,
  `modified_by` varchar(45) DEFAULT NULL,
  `modified_time` char(14) DEFAULT NULL,
  `created_by` varchar(45) DEFAULT NULL,
  `created_time` char(14) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
```
# 3 服务端（Jess）
## 3.1 使用[Mybatis generator][b296c1dd]创建DAO层文件
### 3.1.1 [Mybatis generator][b296c1dd]配置
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <classPathEntry location="./libs/mysql-connector-java-5.1.43.jar" />
        <!-- Database Connection Settings -->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://127.0.0.1:3306/jess?useUnicode=true&amp;characterEncoding=utf-8&amp;autoReconnect=true&amp;useSSL=false"
                        userId="root"
                        password="YourPassword">
        </jdbcConnection>
        <javaTypeResolver>
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <!-- Generate file position settings -->
        <javaModelGenerator targetPackage="com.jzsec.base.user.entity" targetProject="./src/main/java">
            <property name="enableSubPackages" value="true" />
            <!-- Trim string  -->
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <sqlMapGenerator targetPackage="com.jzsec.base.user.mapper" targetProject="./src/main/java">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.jzsec.base.user.dao" targetProject="./src/main/java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <table tableName="dictionary">
            <generatedKey column="id" sqlStatement="JDBC" identity="true"/>
        </table>
    </context>
</generatorConfiguration>
```
### 3.1.2 运行generator
![Run Mybatis Generator as Maven](src/components/REST/doc/run-mybatis-generator-as-maven.png)
### 3.1.3 Generator自动生成的文件
![Generated files](src/components/REST/doc/generated-files.png)

## 3.2 创建Repository
使用[Spring Data Rest][048238ad]将Entity CRUD映射到Restful API
### 3.2.1 为Dictionary实体类添加 `Entity` 和 `Id` 注解
```
package com.jzsec.base.dictionary.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Dictionary {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @GenericGenerator(name = "increment", strategy = "increment")
    private Integer id;

    private String dictEntry;

    private String dictKey;

    private String dictValue;

    private String dictRemark;

    private String modifiedBy;

    private String modifiedTime;

    private String createdBy;

    private String createdTime;

    private Boolean deleted;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDictEntry() {
        return dictEntry;
    }

    public void setDictEntry(String dictEntry) {
        this.dictEntry = dictEntry == null ? null : dictEntry.trim();
    }

    public String getDictKey() {
        return dictKey;
    }

    public void setDictKey(String dictKey) {
        this.dictKey = dictKey == null ? null : dictKey.trim();
    }

    public String getDictValue() {
        return dictValue;
    }

    public void setDictValue(String dictValue) {
        this.dictValue = dictValue == null ? null : dictValue.trim();
    }

    public String getDictRemark() {
        return dictRemark;
    }

    public void setDictRemark(String dictRemark) {
        this.dictRemark = dictRemark == null ? null : dictRemark.trim();
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy == null ? null : modifiedBy.trim();
    }

    public String getModifiedTime() {
        return modifiedTime;
    }

    public void setModifiedTime(String modifiedTime) {
        this.modifiedTime = modifiedTime == null ? null : modifiedTime.trim();
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy == null ? null : createdBy.trim();
    }

    public String getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(String createdTime) {
        this.createdTime = createdTime == null ? null : createdTime.trim();
    }

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }
}
```

### 3.2.2 创建Repository类
```
package com.jzsec.base.dictionary.repository;

import com.jzsec.base.dictionary.entity.Dictionary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource(path = "dictionaries")
@CrossOrigin(origins = "*")
public interface DictionaryRepository extends JpaRepository<Dictionary, Integer> {

    // Search by entry
    @RestResource(path = "dictEntry", rel = "dictEntryContains")
    Page<Dictionary> findByDictEntryContains(@Param(value = "keyword") String keyword, Pageable pageable);

    // Search by key
    @RestResource(path = "dictKey", rel = "dictKeyContains")
    Page<Dictionary> findByDictKeyContains(@Param(value = "keyword") String keyword, Pageable pageable);

    // Search by value
    @RestResource(path = "dictValue", rel = "dictValueContains")
    Page<Dictionary> findByDictValueContains(@Param(value = "keyword") String keyword, Pageable pageable);
}
```
### 3.2.3 通过[Spring Data REST Configuration][eb75fda9]暴露实体类ID
由于Spring Data REST默认不暴露实体类ID字段（dictionary.id）,需要通过[Spring Data REST Configuration][eb75fda9]暴露ID字段
```
package com.jzsec.base.common.config;

import com.jzsec.base.dictionary.entity.Dictionary;
import com.jzsec.base.history.entity.HistoryAction;
import com.jzsec.base.history.entity.HistoryLog;
import com.jzsec.base.history.entity.HistoryTarget;
import com.jzsec.base.user.entity.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
class SpringDataRestConfig {
    @Bean
    public RepositoryRestConfigurer repositoryRestConfigurer() {

        return new RepositoryRestConfigurerAdapter() {
            @Override
            public void configureRepositoryRestConfiguration(
                    RepositoryRestConfiguration config) {
                config.exposeIdsFor(Dictionary.class);
            }
        };
    }
}
```

# 4 前端实现
## 4.1 创建Jeff Entity（Jeff Entity类似于Django Model）
```
import { CharField, IntegerField, TextField } from '../../components/Entity/Field';
import Entity from '../../components/Entity/index';
import { entities } from '../../config/entity';

export class JessDictionaryEntity extends Entity {
  constructor() {
    super({
      namespace : 'jessDictionary',
      displayName : 'Dictionary',
      url : '/api/dictionaries',
      listDataWrap : 'dictionaries',
    });

    this.id = new IntegerField({ verboseName: 'ID', creatable: false, editable: false });
    this.dictEntry = new CharField({ maxLength: 100, allowBlank: false, verboseName: '类型', editable: false });
    this.dictKey = new CharField({ maxLength: 200, allowBlank: false, verboseName: '键', editable: false });
    this.dictValue = new TextField({ maxLength: 500, allowBlank: false, verboseName: '值' });
    this.dictRemark = new TextField({maxLength: 500, verboseName: '备注'});
  }
  verboseName = (instance) => {
    return `${instance.dictEntry} - ${instance.dictKey}`;
  };
  fields = ['id', 'dictEntry', 'dictKey', 'dictValue', 'dictRemark'];
  listSort = ['dictEntry', 'dictKey', 'dictValue'];
  listDisplay = ['dictEntry', 'dictKey', 'dictValue'];
  listFilter = ['dictEntry', 'dictKey', 'dictValue'];
}
```
## 4.2 使用Jeff REST Dva Model Factory创建dva-model
```
import restModelFactory from '../utils/restDvaModelFactory4SpringDataRestWithJpa';
import { JessDictionaryEntity } from '../routes/Jess/Dictionary';

export const jessDictionaryEntity = new JessDictionaryEntity();

export default {
  namespace: 'jessDictionary',
  ...restModelFactory(jessDictionaryEntity),
};
```
## 4.3 使用Jeff RestCrud创建页面
```
import React from 'react';
import { connect } from 'dva';
import RestCrud from '../../components/REST/index';

@connect(({ jessDictionary, loading }) => ({
  jessDictionary,
  fetching: loading.effects['jessDictionary/fetchOne'],
  listing: loading.effects['jessDictionary/list'],
  deleting: loading.effects['jessDictionary/delete'],
  creating: loading.effects['jessDictionary/create'],
  updating: loading.effects['jessDictionary/update'],
}))
export default class JessDictionaries extends React.Component {
  render() {
    const { jessDictionary, fetching, listing, deleting, creating, updating, dispatch } = this.props;
    return (
      <RestCrud
        dispatch={dispatch}
        data={jessDictionary.list}
        pagination={jessDictionary.pagination}
        fetching={fetching}
        listing={listing}
        deleting={deleting}
        creating={creating}
        updating={updating}
        entity={new JessDictionaryEntity()}
      />
    );
  }
}
```

# 5. 运行
## 5.1 列表
![List View](src/components/REST/doc/list-view.png)
## 5.2 详情
![Detail View](src/components/REST/doc/detail-view.png)
## 5.3 新增
![Create View](src/components/REST/doc/create-view.png)
## 5.4 修改
![Edit View](src/components/REST/doc/edit-view.png)
## 5.5 删除
![Delete View](src/components/REST/doc/delete-view.png)
