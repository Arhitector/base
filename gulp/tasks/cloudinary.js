var cloudinary = require('cloudinary'),
	async = require('async'),
	request = require('request'),
	_ = require('lodash'),
	del = require('del');

module.exports = new function () {
	cloudinary.config(cfg.cloudinaryConfig);

	function getLocalMediaFiles() {
		var files = glob.sync(cfg.src.media + '/**/*.' + IMAGE_FORMATS);

		files = _.map(files, function (file) {
			file = {
				path: file
			};
			file.bytes = fs.statSync(file.path).size;
			return file;
		});
		files = _.mapKeys(files, function (file) {
			return cfg.cloudinary.dir + '/' + file.path.substr(cfg.src.media.length + 1).replace(path.extname(file.path), '');
		});

		return files;
	}

	gulp.task('cloudinary', function (cb) {
		if (args.upload) {
			var files = glob.sync(cfg.src.media + '/**/*.' + IMAGE_FORMATS),
				progressData = {
					uploaded: 0,
					total: files.length
				};

			if (progressData.total > 0) {
				async.forEachOf(files, function (file, i, callback) {
					var publicId = cfg.cloudinary.dir + '/' + file.substr(cfg.src.media.length + 1).replace(path.extname(file), '');

					console.log('Uploading %d/%d "%s" as "%s"', i + 1, progressData.total, file, publicId);
					cloudinary.uploader.upload(file, function (result) {
						if (result.error) {
							callback(result.error.http_code ? result.error.http_code + ': ' + result.error.message : result.error);
						}
						else {
							progressData.uploaded++;
							callback();
						}
					}, {
						public_id: publicId
					});
				}, function (error) {
					if (error) {
						throw new Error(error);
					}
					else {
						console.log('Complete. Uploaded %d/%d images', progressData.uploaded, progressData.total);
						cb();
					}
				});
			}
			else {
				cb();
			}
		}
		else if (args.download) {
			cloudinary.api.resources(function (result) {
				if (result.error) {
					throw new Error(result.error.http_code + ': ' + result.error.message);
				}
				else {
					var files = result.resources,
						progressData = {
							uploaded: 0,
							total: files.length
						};

					if (files.length > 0) {
						async.forEachOf(files, function (file, i, callback) {
							var destFile = cfg.src.media + '/' + file.public_id.substr(cfg.cloudinary.dir.length + 1) + '.' + file.format;

							console.log('Downloading %d/%d "%s" to "%s"', i + 1, progressData.total, file.public_id, destFile);
							request
								.get(file.url)
								.on('error', function (err) {
									callback(err);
								})
								.on('end', function () {
									progressData.uploaded++;
									callback();
								})
								.pipe(fs.createWriteStream(destFile));
						}, function (error) {
							if (error) {
								throw new Error(error);
							}
							else {
								console.log('Complete. Downloaded %d/%d images', progressData.uploaded, progressData.total);
								cb();
							}
						});
					}
					else {
						cb();
					}
				}
			}, {
				prefix: cfg.cloudinary.dir + '/',
				type: 'upload'
			});
		}
		else if (args.clean) {
			cloudinary.api.delete_resources_by_prefix(cfg.cloudinary.dir + '/',
				function (result) {
					if (result.error) {
						throw new Error(result.error.http_code + ': ' + result.error.message);
					}
					else {
						console.log('Complete. Cleared.');
						cb();
					}
				});
		}
		else if (args.syncCloud) {
			cloudinary.api.resources(function (result) {
				if (result.error) {
					throw new Error(result.error.http_code + ': ' + result.error.message);
				}
				else {
					var localFiles = getLocalMediaFiles(),
						files = result.resources,
						progressData = {
							uploaded: 0,
							deleted: 0
						};

					if (files.length > 0) {
						files = _.mapKeys(files, function (file) {
							return file.public_id;
						});
						async.each(
							[
								function (next) {
									async.forEachOf(localFiles, function (file, publicId, callback) {
										if (!files[publicId] || files[publicId].bytes != file.bytes) {
											console.log('Uploading "%s" as "%s"', file.path, publicId);
											cloudinary.uploader.upload(file.path, function (result) {
												if (result.error) {
													callback(result.error.http_code ? result.error.http_code + ': ' + result.error.message : result.error);
												}
												else {
													progressData.uploaded++;
													callback();
												}
											}, {
												public_id: publicId
											});
										} else {
											callback();
										}
									}, function (error) {
										if (error) {
											throw new Error(error);
										}
										else {
											console.log('Uploaded %d images', progressData.uploaded);
											next();
										}
									});
								},
								function (next) {
									async.forEachOf(files, function (file, publicId, callback) {
										if (!localFiles[publicId]) {
											console.log('Deleting "%s"', publicId);
											cloudinary.api.delete_resources([publicId],
												function (result) {
													if (result.error) {
														throw new Error(result.error.http_code + ': ' + result.error.message);
													}
													else {
														progressData.deleted++;
														callback();
													}
												});
										} else {
											callback();
										}
									}, function (error) {
										if (error) {
											throw new Error(error);
										}
										else {
											console.log('Deleted %d images', progressData.deleted);
											next();
										}
									});
								}
							],
							function (func, callback) {
								func(callback);
							},
							function () {
								console.log('Completed. Synchronized %d.', progressData.uploaded + progressData.deleted);
								cb();
							}
						);
					}
					else {
						cb();
					}
				}
			}, {
				prefix: cfg.cloudinary.dir + '/',
				type: 'upload'
			});
		}
		else if (args.syncLocal) {
			cloudinary.api.resources(function (result) {
				if (result.error) {
					throw new Error(result.error.http_code + ': ' + result.error.message);
				}
				else {
					var localFiles = getLocalMediaFiles(),
						files = result.resources,
						progressData = {
							downloaded: 0,
							deleted: 0
						};

					if (_.keys(localFiles).length > 0) {
						files = _.mapKeys(files, function (file) {
							return file.public_id;
						});
						async.each(
							[
								function (next) {
									async.forEachOf(files, function (file, publicId, callback) {
										if (!localFiles[publicId] || localFiles[publicId].bytes != file.bytes) {
											var destFile = cfg.src.media + '/' + publicId.substr(cfg.cloudinary.dir.length + 1) + '.' + file.format;

											console.log('Downloading "%s" to "%s"', publicId, destFile);
											mkdirp(path.dirname(destFile), function (err) {
												if (err !== null) {
													callback(err);
												}
												else {
													request
														.get(file.url)
														.on('error', function (err) {
															callback(err);
														})
														.on('end', function () {
															progressData.downloaded++;
															callback();
														})
														.pipe(fs.createWriteStream(destFile));
												}
											});
										} else {
											callback();
										}
									}, function (error) {
										if (error) {
											throw new Error(error);
										}
										else {
											console.log('Downloaded %d images', progressData.downloaded);
											next();
										}
									});
								},
								function (next) {
									async.forEachOf(localFiles, function (file, publicId, callback) {
										if (!files[publicId]) {
											var destFile = cfg.src.media + '/' + publicId.substr(cfg.cloudinary.dir.length + 1) + path.extname(file.path);

											console.log('Deleting "%s"', destFile);
											del(destFile, function (err, paths) {
												if (err !== null) {
													callback(err);
												}
												else {
													progressData.deleted++;
													callback();
												}
											});
										} else {
											callback();
										}
									}, function (error) {
										if (error) {
											throw new Error(error);
										}
										else {
											console.log('Deleted %d images', progressData.deleted);
											next();
										}
									});
								}
							],
							function (func, callback) {
								func(callback);
							},
							function () {
								console.log('Completed. Synchronized %d.', progressData.downloaded + progressData.deleted);
								cb();
							}
						);
					}
					else {
						cb();
					}
				}
			}, {
				prefix: cfg.cloudinary.dir + '/',
				type: 'upload'
			});
		}
		else {
			var mediaDir = cfg.src.media;

			console.log('Use flags:');
			console.log('  --upload    - upload images from "%s" dir to cloud', mediaDir);
			console.log('  --download  - download images from cloud to "%s" dir', mediaDir);
			console.log('  --clean     - removes all images from cloud');
			console.log('  --syncCloud - makes cloud to be identically to "%s" dir', mediaDir);
			console.log('  --syncLocal - makes "%s" dir to be identically to cloud', mediaDir);
			cb();
		}
	});
};