<template>
  <!-- （自动上传） action 是上传地址 不用 -->
  <!-- show-file-list展示文字的上传列表 （不展示 -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
// 图片是打算存在一个腾讯云服务器的 具体没有写
// 一般图片视频啥的都是放在第三方服务器上面，减轻后端服务器的压力
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 上传之前检查 判断文件的类型和大小 return true（继续上传/ false(停止上传
    beforeAvatarUpload(file) {
      // jpeg png gif bmp
      const isJPG = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPEG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
