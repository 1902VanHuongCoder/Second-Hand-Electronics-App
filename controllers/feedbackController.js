exports.deleteFeedBack = async (req, res) => {
    const { maDanhGia } = req.params;
    try {
        // First find the feedback to get the image URLs
        const feedBack = await FeedBack.findOne({
            MaDanhGia: maDanhGia,
        });

        if (!feedBack) {
            return res.status(404).json({ message: "Mã đánh giá không tồn tại." });
        }

        // Delete images from Cloudinary if they exist
        if (feedBack.HinhAnhSanPham && feedBack.HinhAnhSanPham.length > 0) {
            const deletePromises = feedBack.HinhAnhSanPham.map(imageUrl => {
                // Extract public_id from the Cloudinary URL
                const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
                return cloudinary.uploader.destroy(`feedbacks/${publicId}`);
            });

            await Promise.all(deletePromises);
        }

        // Now delete the feedback from database
        await FeedBack.findOneAndDelete({
            MaDanhGia: maDanhGia,
        });

        res.status(200).json({ message: "Mã đánh giá và hình ảnh đã được xóa thành công." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 