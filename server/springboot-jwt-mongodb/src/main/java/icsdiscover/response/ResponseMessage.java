package icsdiscover.response;

public class ResponseMessage<T> {
	
	int status;
    String message;
    T result;
	
	public ResponseMessage(int status, String message, T result) {
		super();
		this.status = status;
		this.message = message;
		this.result = result;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getResult() {
		return result;
	}

	public void setResult(T result) {
		this.result = result;
	}

	@Override
	public String toString() {
		return "ResponseMessage [status=" + status + ", message=" + message + ", result=" + result + "]";
	}
}