
require('../core/CommonUtil');
var pool=require('../jdbc').pool;

/**
 * jdbc model 客户端
 */
SqlClient=function(){};
SqlClient.prototype={
	
	//根据id获取
	getById : function(obj,callback){
		pool.getConnection(function(err, connection) {
			var sql = 'SELECT * FROM '+obj['table_name']+' WHERE ID = '+obj['id'];
			console.log('##    sql: '+sql);
			connection.query(sql, function(err, result) {
				if(err){
		        	console.log('[getById error] - ',err.message);
		        	return;
		        }
				if(result != null && result.length > 0){
					obj = result[0];
					callback(obj);
				}else{
					callback(null);
				}
	        });
			connection.release();
		});
	},
	
	//查询列表
	query : function(obj,callback){
		pool.getConnection(function(err, connection) {
			var sql = 'SELECT * FROM '+obj['table_name'];
			console.log('##    sql: '+sql);
			connection.query(sql, function(err, result) {
				if(err){
		        	console.log('[query error] - ',err.message);
		        	return;
		        }
	            callback(result);
	        });
			connection.release();
		});
	},
	
	//创建
	create : function(obj,callback){
		var cols = [];
		var params = [];
		var paramValues = [];
		for(var name in obj){
			if(obj.hasOwnProperty(name) && name != 'table_name'){
				if(name == 'id' && CommonUtil.isStrEmpty(obj[name])){//mysql id 自增处理
				}else{
					console.log(obj.hasOwnProperty(name));
					cols.push(name);
					params.push('?');
					paramValues.push(obj[name]);
				}
			}
	    }
		pool.getConnection(function(err, connection) {
			var sql = 'INSERT INTO '+obj['table_name']+'('+cols.join(',')+') VALUES('+params+')';
			console.log('##    sql: '+sql);
			console.log('## values: '+paramValues);
			connection.query(sql,paramValues,function (err, result) {
		        if(err){
		        	console.log('[create error] - ',err.message);
		        	return;
		        }
		        callback(result.insertId);//插入的id
			});
			connection.release();
		});
	},
	
	//更新，如果不为null就更新
	update : function(obj,callback){
		var cols = [];
		var paramValues = [];
		for(var name in obj){
			if(obj.hasOwnProperty(name) && name != 'table_name' && name != 'id' && obj[name] != null){
				cols.push(name+"=?");
				paramValues.push(obj[name]);
			}
	    }
		pool.getConnection(function(err, connection) {
			var sql = 'UPDATE '+obj['table_name']+' SET '+cols.join(',') + ' WHERE ID = ' + obj['id'];
			console.log('##    sql: '+sql);
			console.log('## values: '+paramValues);
			connection.query(sql,paramValues,function (err, result) {
		        if(err){
		        	console.log('[update error] - ',err.message);
		        	return;
		        }
		        callback(result.affectedRows);//影响的行数
			});
			connection.release();
		});
	},
	
	//删除
	deleteById : function(obj,callback){
		pool.getConnection(function(err, connection) {
			var sql = 'DELETE FROM '+obj['table_name']+' WHERE ID = '+obj['id'];
			console.log('##    sql: '+sql);
			connection.query(sql, function(err, result) {
				if(err){
		        	console.log('[deleteById error] - ',err.message);
		        	return;
		        }
				callback(result.affectedRows);//影响的行数
	        });
			connection.release();
		});
	},
	
	//执行SQL
	queryBySql : function(sql,paramValues,callback){
		pool.getConnection(function(err, connection) {
			console.log('##    sql: '+sql);
			console.log('## values: '+paramValues);
			connection.query(sql,paramValues,function (err, result) {
				if(err){
		        	console.log('[queryBySql error] - ',err.message);
		        	return;
		        }
	            callback(result);
			});
			connection.release();
		});
	}
	
};


