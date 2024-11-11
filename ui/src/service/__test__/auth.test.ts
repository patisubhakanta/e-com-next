import axios from 'axios';
import { resetPassword } from '../auth';
import { API } from '@/route/Route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; // Type the mock as Jest's mocked version of axios

describe('resetPassword function', () => {
  it('should reset the password successfully and return data', async () => {
    const mockEmail = 'test@example.com';
    const mockNewPassword = 'newPassword123';
    const mockResponseData = { message: 'Password reset successfully' };

    // Mock the axios.post response
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

    const result = await resetPassword(mockEmail, mockNewPassword);

    expect(result).toEqual(mockResponseData); // Assert that the correct data is returned
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.RESET_PASSWORD, {
      email: mockEmail,
      newPassword: mockNewPassword,
    }); // Ensure axios.post was called with correct arguments
  });

  it('should throw an error with a message if the request fails', async () => {
    const mockEmail = 'test@example.com';
    const mockNewPassword = 'newPassword123';
    const mockErrorMessage = 'Failed to reset password.';

    // Mock the axios.post to simulate an error response
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: mockErrorMessage } },
    });

    try {
      await resetPassword(mockEmail, mockNewPassword);
    } catch (error) {
      expect(error).toEqual(new Error(mockErrorMessage)); // Assert that the error is thrown with the correct message
    }
  });
});
